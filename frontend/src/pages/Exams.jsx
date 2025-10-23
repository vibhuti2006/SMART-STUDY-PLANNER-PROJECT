import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { examsAPI, subjectsAPI } from '../services/api';  // ADD subjectsAPI for dropdown
import { Dialog, Transition } from '@headlessui/react';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object({
  title: yup.string().required('Title required'),
  examDate: yup.string().required('Date required'),
  examTime: yup.string().required('Time required'),
  totalMarks: yup.number().required('Marks required'),
  subjectId: yup.string().required('Subject required'),
});

const Exams = () => {
  const queryClient = useQueryClient();
  const { data: response, isLoading } = useQuery({ 
    queryKey: ['exams'], 
    queryFn: examsAPI.getAll 
  });
  const exams = response?.data?.data || [];
  const { data: subjectsResponse } = useQuery({  // FIXED: Fetch subjects for dropdown
    queryKey: ['subjects'], 
    queryFn: subjectsAPI.getAll 
  });
  const subjects = subjectsResponse?.data?.data || [];
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const createMutation = useMutation({
    mutationFn: examsAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exams'] });
      setOpen(false);
      setError('');
    },
    onError: (err) => {
      setError(err.response?.data?.message || 'Failed to create exam');
      console.error('Create error:', err);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (variables) => examsAPI.update(variables.id, variables.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exams'] });
      setOpen(false);
      setEditingId(null);
      setError('');
    },
    onError: (err) => {
      setError(err.response?.data?.message || 'Failed to update exam');
      console.error('Update error:', err);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: examsAPI.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['exams'] }),
    onError: (err) => {
      setError(err.response?.data?.message || 'Failed to delete exam');
      console.error('Delete error:', err);
    },
  });

  const onSubmit = (data) => {
    setError('');
    if (editingId) {
      updateMutation.mutate({ id: editingId, data });
    } else {
      createMutation.mutate(data);
    }
    reset();
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <span className="ml-2 text-gray-600">Loading exams...</span>
    </div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Exams</h1>
        <button
          onClick={() => { setEditingId(null); setOpen(true); setError(''); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
          disabled={createMutation.isPending}
        >
          <PlusIcon className="h-4 w-4 mr-2" /> Add Exam
        </button>
      </div>
      {error && <p className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm mb-4">{error}</p>}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days Until</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {exams.map((exam) => {
              const days = exam.daysUntilExam || Math.ceil((new Date(exam.examDate) - new Date()) / (1000 * 60 * 60 * 24));
              return (
                <tr key={exam._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{exam.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(exam.examDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{days > 0 ? days : 'Past'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{exam.preparationStatus}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button
                      onClick={() => { setEditingId(exam._id); reset(exam); setOpen(true); setError(''); }}
                      className="text-indigo-600 hover:text-indigo-900 p-1"
                      disabled={updateMutation.isPending}
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => { if (confirm('Delete this exam?')) deleteMutation.mutate(exam._id); }}
                      className="text-red-600 hover:text-red-900 p-1"
                      disabled={deleteMutation.isPending}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {exams.length === 0 && <p className="text-gray-500 mt-4">No exams yet. Add one to track your progress!</p>}

      {/* Modal */}
      <Transition show={open} as="div">
        <Dialog onClose={() => setOpen(false)} className="relative z-50">
          <Transition.Child
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title className="text-lg font-medium text-gray-900">
                    {editingId ? 'Edit' : 'Add'} Exam
                  </Dialog.Title>
                  <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
                    <input {...register('title')} placeholder="Exam Title" className="w-full p-2 border rounded" />
                    {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
                    <input {...register('examDate')} type="date" className="w-full p-2 border rounded" />
                    {errors.examDate && <p className="text-red-500 text-sm">{errors.examDate.message}</p>}
                    <input {...register('examTime')} placeholder="Time (HH:MM)" className="w-full p-2 border rounded" />
                    {errors.examTime && <p className="text-red-500 text-sm">{errors.examTime.message}</p>}
                    <input {...register('totalMarks')} type="number" placeholder="Total Marks" className="w-full p-2 border rounded" />
                    {errors.totalMarks && <p className="text-red-500 text-sm">{errors.totalMarks.message}</p>}
                    {/* FIXED: Populated dropdown */}
                    <select {...register('subjectId')} className="w-full p-2 border rounded">
                      <option value="">Select Subject</option>
                      {subjects.map((subject) => (
                        <option key={subject._id} value={subject._id}>
                          {subject.name}
                        </option>
                      ))}
                    </select>
                    {errors.subjectId && <p className="text-red-500 text-sm">{errors.subjectId.message}</p>}
                    <div className="flex justify-end space-x-2">
                      <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 text-gray-500 bg-gray-200 rounded">
                        Cancel
                      </button>
                      <button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50">
                        Save
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default Exams;