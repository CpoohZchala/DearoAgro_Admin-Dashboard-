import React, { useState, useEffect, useRef } from "react";
import {
  getGroups,
  createGroup,
  deleteGroup,
  editGroup,
  assignFarmerToGroup,
} from "../../api/groupApi";
import AssignToGroupModal from "./AssignToGroupModal";
import ConfirmDialog from '../dialogs/ConfirmDialog';
import EditGroupDialog from '../dialogs/EditGroupDialog';
import GroupMembersModal from './GroupMembersModal';
import { FaEdit, FaTrash, FaEllipsisV } from "react-icons/fa";

interface Group {
  _id: string;
  name: string;
}

const GroupManagement: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [newGroupName, setNewGroupName] = useState("");
  const [error, setError] = useState("");
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmDialogMessage, setConfirmDialogMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState<() => void>(
    () => () => {}
  );
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingGroup, setEditingGroup] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<{ id: string; name: string } | null>(null);
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await getGroups();
        if (!response.success)
          throw new Error(response.message || "Failed to fetch groups");
        console.log("Fetched groups:", response.data); // Log the groups for debugging
        setGroups(response.data);
      } catch (err: any) {
        setError(err.message);
      }
    };
    fetchGroups();
  }, []);

  // Add validation to ensure group names are unique
  const handleCreateGroup = async (groupName: string) => {
    try {
      // Fetch existing groups
      const response = await getGroups();
      if (!response.success) {
        throw new Error('Failed to fetch groups.');
      }

      // Check if the group name already exists
      const existingGroup = response.data.find((group: any) => group.name.toLowerCase() === groupName.toLowerCase());
      if (existingGroup) {
        alert('Group name must be unique. Please choose a different name.');
        return;
      }

      // Proceed with group creation
      const createResponse = await createGroup({ name: groupName });
      if (createResponse.success) {
        alert('Group created successfully!');
      } else {
        throw new Error(createResponse.message || 'Failed to create group.');
      }
    } catch (error: any) {
      console.error('Error creating group:', error);
      alert(error.message);
    }
  };

  const handleAssignFarmerToGroup = async (groupId: string, farmerId: string) => {
    try {
      const response = await assignFarmerToGroup(groupId, farmerId);
      if (!response.success) {
        throw new Error(response.message || 'Failed to assign farmer to group');
      }
      alert('Farmer assigned to group successfully');

      // Refresh groups after assignment
      const updatedGroups = await getGroups();
      if (updatedGroups.success) {
        setGroups(updatedGroups.data);
      }
    } catch (error: any) {
      console.error('Error assigning farmer to group:', error);
      alert('Failed to assign farmer to group. Please try again.');
    }
  };

  const handleOpenAssignModal = (groupId: string) => {
    setSelectedGroupId(groupId);
    setShowAssignModal(true);
  };

  const handleCloseAssignModal = () => {
    setSelectedGroupId(null);
    setShowAssignModal(false);
  };

  const handleAssignComplete = async (groupId: string) => {
    try {
      const response = await getGroups();
      if (!response.success) {
        throw new Error(response.message || 'Failed to refresh groups');
      }
      setGroups(response.data);
      console.log(`Farmers assigned to group ${groupId}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      handleCloseAssignModal();
    }
  };

  const openConfirmDialog = (message: string, action: () => void) => {
    setConfirmDialogMessage(message);
    setConfirmAction(() => action);
    setShowConfirmDialog(true);
  };

  const closeConfirmDialog = () => {
    setShowConfirmDialog(false);
    setConfirmDialogMessage("");
    setConfirmAction(() => () => {});
  };

  const handleEditGroup = (groupId: string, currentName: string) => {
    setEditingGroup({ id: groupId, name: currentName });
    setShowEditDialog(true);
  };

  // Add validation to ensure group names are unique during editing
  const handleEditConfirm = async (newName: string) => {
    if (!editingGroup) return;

    try {
      // Fetch existing groups
      const response = await getGroups();
      if (!response.success) {
        throw new Error('Failed to fetch groups.');
      }

      // Check if the new group name already exists (excluding the current group being edited)
      const existingGroup = response.data.find(
        (group: any) => group.name.toLowerCase() === newName.toLowerCase() && group._id !== editingGroup.id
      );
      if (existingGroup) {
        alert('Group name must be unique. Please choose a different name.');
        return;
      }

      // Proceed with editing the group
      const responseEdit = await editGroup(editingGroup.id, { name: newName });
      if (!responseEdit.success) {
        throw new Error(responseEdit.message || 'Failed to edit group.');
      }
      alert(`Group name changed successfully to: ${newName}`);

      // Refresh the groups list
      const updatedGroups = await getGroups();
      if (updatedGroups.success) {
        setGroups(updatedGroups.data);
      }
    } catch (error: any) {
      console.error('Error editing group:', error);
      alert(error.message);
    } finally {
      setShowEditDialog(false);
      setEditingGroup(null);
    }
  };

  const handleEditCancel = () => {
    setShowEditDialog(false);
    setEditingGroup(null);
  };

  const handleDeleteGroup = async (groupId: string) => {
    openConfirmDialog(
      "Are you sure you want to delete this group?",
      async () => {
        try {
          const response = await deleteGroup(groupId);
          if (!response.success) {
            throw new Error(response.message || "Failed to delete group");
          }
          alert("Group deleted successfully.");
          const updatedGroups = await getGroups();
          if (updatedGroups.success) {
            setGroups(updatedGroups.data);
          }
        } catch (error: any) {
          console.error("Error deleting group:", error);
          alert("Failed to delete group. Please try again.");
        } finally {
          closeConfirmDialog();
        }
      }
    );
  };

  const handleViewMembers = (groupId: string, groupName: string) => {
    setSelectedGroup({ id: groupId, name: groupName });
    setShowMembersModal(true);
  };

  const handleCloseMembersModal = () => {
    setShowMembersModal(false);
    setSelectedGroup(null);
  };

  const toggleGroupOptions = (groupId: string) => {
    setActiveGroupId((prev) => (prev === groupId ? null : groupId));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveGroupId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleAction = (action: () => void) => {
    action();
    setActiveGroupId(null);
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <h2 className="text-3xl font-bold text-black-800 mb-6">
        📂Group Management
      </h2>

      {error && (
        <div className="mb-6 rounded-md bg-red-100 text-red-700 px-4 py-3">
          {error}
        </div>
      )}

      <div className="mb-8 bg-white shadow-sm rounded-lg p-5 space-y-4">
        <input
          type="text"
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
          placeholder="Enter new group name"
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
        />
        <button
          onClick={() => handleCreateGroup(newGroupName)}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-md transition duration-200"
        >
          Create Group
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Existing Groups
        </h3>
        <ul className="space-y-3">
          {groups.map((group) => (
            <li key={group._id} className="relative flex justify-between items-center bg-gray-50 px-4 py-2 rounded hover:bg-gray-100 transition">
              <span className="text-gray-700">{group.name}</span>
              <div className="flex space-x-2">
                <button
                  onClick={() => toggleGroupOptions(group._id)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaEllipsisV />
                </button>
                {activeGroupId === group._id && (
                  <div ref={dropdownRef} className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg z-10">
                    <button
                      onClick={() => handleAction(() => handleEditGroup(group._id, group.name))}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleAction(() => handleDeleteGroup(group._id))}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleAction(() => handleOpenAssignModal(group._id))}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Assign Farmers
                    </button>
                    <button
                      onClick={() => handleAction(() => handleViewMembers(group._id, group.name))}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      View Members
                    </button>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {showAssignModal && selectedGroupId && (
        <AssignToGroupModal
          groupId={selectedGroupId}
          onClose={handleCloseAssignModal}
          onAssign={handleAssignComplete}
        />
      )}

      {showConfirmDialog && (
        <ConfirmDialog
          message={confirmDialogMessage}
          onConfirm={confirmAction}
          onCancel={closeConfirmDialog}
        />
      )}

      {showEditDialog && editingGroup && (
        <EditGroupDialog
          currentName={editingGroup.name}
          onConfirm={handleEditConfirm}
          onCancel={handleEditCancel}
        />
      )}

      {showMembersModal && selectedGroup && (
        <GroupMembersModal
          groupId={selectedGroup.id}
          groupName={selectedGroup.name}
          onClose={handleCloseMembersModal}
        />
      )}
    </div>
  );
};

export default GroupManagement;
