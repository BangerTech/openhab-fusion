import React from 'react';
import { useDispatch } from 'react-redux';
import { setEditingSidebar } from '../store/configStore';

interface EditMenuProps {
  setIsOpen: (isOpen: boolean) => void;
}

export const EditMenu: React.FC<EditMenuProps> = ({ setIsOpen }) => {
  const dispatch = useDispatch();
  
  const handleSidebarEdit = () => {
    dispatch(setEditingSidebar(true));
    // Optional: Schließen Sie das Bearbeitungsmenü
    setIsOpen(false);
  };

  return (
    <div className="edit-menu">
      <button onClick={handleSidebarEdit}>
        Sidebar bearbeiten
      </button>
    </div>
  );
}; 