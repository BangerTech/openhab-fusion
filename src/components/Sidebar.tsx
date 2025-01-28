import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { setEditingSidebar } from '../store/configStore';

export const Sidebar = () => {
  const dispatch = useDispatch();
  const editingSidebar = useSelector((state: RootState) => state.config.editingSidebar);
  
  // ... existing code ...

  return (
    <div className={`sidebar ${editingSidebar ? 'editing' : ''}`}>
      {editingSidebar ? (
        // Bearbeitungsmodus
        <div className="sidebar-edit-mode">
          <h3>Sidebar bearbeiten</h3>
          {/* Hier können Sie Bearbeitungsoptionen hinzufügen */}
          <button onClick={() => dispatch(setEditingSidebar(false))}>
            Bearbeitung beenden
          </button>
        </div>
      ) : (
        // Normaler Anzeigemodus
        // ... existing code ...
      )}
    </div>
  );
}; 