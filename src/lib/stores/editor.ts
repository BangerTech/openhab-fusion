import { writable } from 'svelte/store';

interface EditorState {
  isEditing: boolean;
  editTarget: 'dashboard' | 'sidebar';
}

const initialState: EditorState = {
  isEditing: false,
  editTarget: 'dashboard'
};

function createEditorStore() {
  const { subscribe, set, update } = writable<EditorState>(initialState);

  return {
    subscribe,
    toggleEdit: () => update(state => ({ ...state, isEditing: !state.isEditing })),
    setTarget: (target: 'dashboard' | 'sidebar') => 
      update(state => ({ ...state, editTarget: target })),
    reset: () => set(initialState)
  };
}

export const editorStore = createEditorStore(); 