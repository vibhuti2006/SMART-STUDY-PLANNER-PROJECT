import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { subjectsAPI } from '../services/api';
import { Dialog, Transition } from '@headlessui/react';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object({
  name: yup.string().required('Name required'),
  description: yup.string(),
  difficulty: yup.number().min(1).max(5).required('Difficulty 1-5'),
  priority: yup.string().oneOf(['low', 'medium', 'high']).required('Priority required'),
  syllabus: yup.string().test('is-json-array', 'Syllabus must be valid JSON array', function(value) {
    if (!value) return true;  // Optional
    try {
      JSON.parse(value);
      return Array.isArray(JSON.parse(value));
    } catch {
      return false;
    }
  }),
});

const Subjects = () => {
  const queryClient = useQueryClient();
  const { data: response, isLoading } = useQuery({ 
    queryKey: ['subjects'], 
    queryFn: subjectsAPI.getAll 
  });
  const subjects = response?.data?.data || [];
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
  });

  const createMutation = useMutation({
    mutationFn: subjectsAPI.create,
    onSuccess: (newSubject) => {
      console.log('Subject created:', newSubject);  // ADD: Debug log
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
      setOpen(false);
      setError('');
      reset();
    },
    onError: (err) => {
      console.error('Create error:', err);  // ADD: Debug log
      setError(err.response?.data?.message || 'Failed to create subject');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (variables) => subjectsAPI.update(variables.id, variables.data),
    onSuccess: (updatedSubject) => {
      console.log('Subject updated:', updatedSubject);  // ADD: Debug log
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
      setOpen(false);
      setEditingId(null);
      setError('');
      reset();
    },
    onError: (err) => {
      console.error('Update error:', err);  // ADD: Debug log
      setError(err.response?.data?.message || 'Failed to update subject');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: subjectsAPI.delete,
    onSuccess: () => {
      console.log('Subject deleted');  // ADD: Debug log
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
    },
    onError: (err) => {
      console.error('Delete error:', err);  // ADD: Debug log
      setError(err.response?.data?.message || 'Failed to delete subject');
    },
  });

  const onSubmit = (data) => {
    console.log('Form submitted:', data);  // ADD: Debug log
    setError('');
    // Parse syllabus string to array
    const submitData = {
      ...data,
      syllabus: data.syllabus ? JSON.parse(data.syllabus) : [],
    };
    console.log('Parsed data for submit:', submitData);  // ADD: Debug log
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: submitData });
    } else {
      createMutation.mutate(submitData);
    }
  };

  const openModal = (id = null, subject = null) => {
    setEditingId(id);
    if (id && subject) {
      reset({
        ...subject,
        syllabus: JSON.stringify(subject.syllabus || [], null, 2),  // Stringify for textarea
      });
    } else {
      reset({ name: '', description: '', difficulty: '', priority: '', syllabus: '' });
    }
    setOpen(true);
    setError('');
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <span className="ml-2 text-gray-600">Loading subjects...</span>
    </div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Subjects</h1>
        <button
          onClick={() => openModal()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
          disabled={createMutation.isPending}
        >
          <PlusIcon className="h-4 w-4 mr-2" /> Add Subject
        </button>
      </div>
      {error && <p className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm mb-4">{error}</p>}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completion %</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Study Time (min)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {subjects.map((subject) => (
              <tr key={subject._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{subject.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{subject.completionPercentage}%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{subject.totalStudyTime}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{subject.priority}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <button
                    onClick={() => openModal(subject._id, subject)}
                    className="text-indigo-600 hover:text-indigo-900 p-1"
                    disabled={updateMutation.isPending}
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => { if (confirm('Delete this subject?')) deleteMutation.mutate(subject._id); }}
                    className="text-red-600 hover:text-red-900 p-1"
                    disabled={deleteMutation.isPending}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {subjects.length === 0 && <p className="text-gray-500 mt-4">No subjects yet. Add one to get started!</p>}

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
                    {editingId ? 'Edit' : 'Add'} Subject
                  </Dialog.Title>
                  <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
                    <input {...register('name')} placeholder="Subject Name" className="w-full p-2 border rounded" />
                    {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                    <input {...register('description')} placeholder="Description" className="w-full p-2 border rounded" />
                    <select {...register('difficulty')} className="w-full p-2 border rounded">
                      <option value="">Difficulty (1-5)</option>
                      {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                    {errors.difficulty && <p className="text-red-500 text-sm">{errors.difficulty.message}</p>}
                    <select {...register('priority')} className="w-full p-2 border rounded">
                      <option value="">Priority</option>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                    {errors.priority && <p className="text-red-500 text-sm">{errors.priority.message}</p>}
                    <textarea {...register('syllabus')} placeholder='Syllabus (JSON: [{"name": "Topic1"}])' className="w-full p-2 border rounded h-20" />
                    {errors.syllabus && <p className="text-red-500 text-sm">{errors.syllabus.message}</p>}
                    <div className="flex justify-end space-x-2">
                      <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 text-gray-500 bg-gray-200 rounded">
                        Cancel
                      </button>
                      <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50">
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

export default Subjects;




