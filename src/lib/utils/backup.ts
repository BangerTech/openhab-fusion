// Neues Backup-System
export class BackupManager {
  static async createBackup() {
    const backup = {
      dashboard: localStorage.getItem('dashboard'),
      tabs: localStorage.getItem('tabs'),
      sidebarItems: localStorage.getItem('sidebarItems'),
      timestamp: new Date().toISOString()
    };

    try {
      const backups = JSON.parse(localStorage.getItem('backups') || '[]');
      backups.push(backup);
      // Behalte nur die letzten 5 Backups
      if (backups.length > 5) backups.shift();
      localStorage.setItem('backups', JSON.stringify(backups));
    } catch (e) {
      console.error('Failed to create backup:', e);
    }
  }

  static async restoreBackup(timestamp: string) {
    try {
      const backups = JSON.parse(localStorage.getItem('backups') || '[]');
      const backup = backups.find(b => b.timestamp === timestamp);
      if (backup) {
        localStorage.setItem('dashboard', backup.dashboard);
        localStorage.setItem('tabs', backup.tabs);
        localStorage.setItem('sidebarItems', backup.sidebarItems);
        return true;
      }
      return false;
    } catch (e) {
      console.error('Failed to restore backup:', e);
      return false;
    }
  }
} 