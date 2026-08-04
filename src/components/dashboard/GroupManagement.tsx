import React, { useState, useEffect, useRef } from "react";
import {
  getGroups,
  createGroup,
  deleteGroup,
  editGroup,
  assignFarmerToGroup,
} from "../../api/groupApi";
import AssignToGroupModal from "./AssignToGroupModal";
import ConfirmDialog from "../dialogs/ConfirmDialog";
import EditGroupDialog from "../dialogs/EditGroupDialog";
import GroupMembersModal from "./GroupMembersModal";
import { FaEllipsisV } from "react-icons/fa";

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
  const [selectedGroup, setSelectedGroup] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await getGroups();
        if (!response.success) {
          throw new Error(response.message || "Failed to fetch groups");
        }

        console.log("Fetched groups:", response.data);
        setGroups(response.data);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchGroups();
  }, []);

  const filteredGroups = groups.filter((group) => {
    const groupName = group.name || "";
    return groupName.toLowerCase().includes(searchText.toLowerCase().trim());
  });

  const handleClearSearch = () => {
    setSearchText("");
  };

  const handleCreateGroup = async (groupName: string) => {
    const trimmedGroupName = groupName.trim();

    if (!trimmedGroupName) {
      alert("Please enter a group name.");
      return;
    }

    try {
      const response = await getGroups();
      if (!response.success) {
        throw new Error("Failed to fetch groups.");
      }

      const existingGroup = response.data.find(
        (group: any) =>
          group.name.toLowerCase() === trimmedGroupName.toLowerCase()
      );

      if (existingGroup) {
        alert("Group name must be unique. Please choose a different name.");
        return;
      }

      const createResponse = await createGroup({ name: trimmedGroupName });

      if (createResponse.success) {
        alert("Group created successfully!");

        const updatedGroups = await getGroups();
        if (updatedGroups.success) {
          setGroups(updatedGroups.data);
        }

        setNewGroupName("");
      } else {
        throw new Error(createResponse.message || "Failed to create group.");
      }
    } catch (error: any) {
      console.error("Error creating group:", error);
      alert(error.message);
    }
  };

  const handleAssignFarmerToGroup = async (
    groupId: string,
    farmerId: string
  ) => {
    try {
      const response = await assignFarmerToGroup(groupId, farmerId);

      if (!response.success) {
        throw new Error(response.message || "Failed to assign farmer to group");
      }

      alert("Farmer assigned to group successfully");

      const updatedGroups = await getGroups();
      if (updatedGroups.success) {
        setGroups(updatedGroups.data);
      }
    } catch (error: any) {
      console.error("Error assigning farmer to group:", error);
      alert("Failed to assign farmer to group. Please try again.");
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
        throw new Error(response.message || "Failed to refresh groups");
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

  const handleEditConfirm = async (newName: string) => {
    if (!editingGroup) return;

    const trimmedNewName = newName.trim();

    if (!trimmedNewName) {
      alert("Please enter a group name.");
      return;
    }

    try {
      const response = await getGroups();

      if (!response.success) {
        throw new Error("Failed to fetch groups.");
      }

      const existingGroup = response.data.find(
        (group: any) =>
          group.name.toLowerCase() === trimmedNewName.toLowerCase() &&
          group._id !== editingGroup.id
      );

      if (existingGroup) {
        alert("Group name must be unique. Please choose a different name.");
        return;
      }

      const responseEdit = await editGroup(editingGroup.id, {
        name: trimmedNewName,
      });

      if (!responseEdit.success) {
        throw new Error(responseEdit.message || "Failed to edit group.");
      }

      alert(`Group name changed successfully to: ${trimmedNewName}`);

      const updatedGroups = await getGroups();
      if (updatedGroups.success) {
        setGroups(updatedGroups.data);
      }
    } catch (error: any) {
      console.error("Error editing group:", error);
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
    openConfirmDialog("Are you sure you want to delete this group?", async () => {
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
    });
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
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setActiveGroupId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleAction = (action: () => void) => {
    action();
    setActiveGroupId(null);
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        📂 Group Management
      </h2>

      {error && (
        <div className="mb-6 rounded-md bg-red-100 text-red-700 px-4 py-3">
          {error}
        </div>
      )}

      <div className="mb-8 bg-white shadow-sm rounded-lg p-5 space-y-4 border border-gray-100">
        <label className="block text-sm font-semibold text-gray-700">
          New Group Name
        </label>

        <input
          type="text"
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
          placeholder="Enter new group name"
          className="w-full bg-white text-gray-900 placeholder-gray-400 border border-gray-300 rounded-md px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none"
        />

        <button
          onClick={() => handleCreateGroup(newGroupName)}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-md transition duration-200"
        >
          Create Group
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 border border-gray-100">
        {/* Group Search Top Bar */}
        <div className="sticky top-0 z-20 mb-6 bg-white/95 backdrop-blur-sm py-4 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Existing Groups
              </h3>
              <p className="text-sm text-gray-500">
                Showing {filteredGroups.length} of {groups.length} groups
              </p>
            </div>

            <div className="w-full lg:w-80">
              <div className="relative">
                <input
                  type="text"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="Search group by name..."
                  className="w-full bg-white text-gray-900 placeholder-gray-400 border border-gray-200 rounded-full py-3 pl-5 pr-12 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />

                {searchText && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 text-sm flex items-center justify-center"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {filteredGroups.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No groups found
            </h3>
            <p className="text-gray-500">Try another group name</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {filteredGroups.map((group) => (
              <li
                key={group._id}
                className="relative flex justify-between items-center bg-gray-50 px-4 py-3 rounded-lg hover:bg-gray-100 transition border border-gray-100"
              >
                <span className="text-gray-800 font-medium">{group.name}</span>

                <div className="flex space-x-2">
                  <button
                    onClick={() => toggleGroupOptions(group._id)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FaEllipsisV />
                  </button>

                  {activeGroupId === group._id && (
                    <div
                      ref={dropdownRef}
                      className="absolute right-0 top-10 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden"
                    >
                      <button
                        onClick={() =>
                          handleAction(() =>
                            handleEditGroup(group._id, group.name)
                          )
                        }
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          handleAction(() => handleDeleteGroup(group._id))
                        }
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Delete
                      </button>

                      <button
                        onClick={() =>
                          handleAction(() => handleOpenAssignModal(group._id))
                        }
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Assign Farmers
                      </button>

                      <button
                        onClick={() =>
                          handleAction(() =>
                            handleViewMembers(group._id, group.name)
                          )
                        }
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
        )}
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