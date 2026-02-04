import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getUsers, createUser, updateUser, deleteUser } from "../api/userApi";
import UserList from "../components/UserList";
import UserForm from "../components/UserForm";
import { Box, Dialog, DialogContent, DialogActions, Button, Typography } from "@mui/material";

export default function UserPage() {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const loadUsers = async () => {
    const res = await getUsers();
    setUsers(res.data);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleSubmit = async (data) => {
    if (selectedUser) {
      await updateUser(selectedUser.id, data);
    } else {
      await createUser(data);
    }
    setOpenForm(false);
    loadUsers();
  };

  const handleDelete = async () => {
    await deleteUser(deleteId);
    setDeleteId(null);
    loadUsers();
  };

  return (
    <Box sx={{ p: 3 }}>
      <UserList
        users={users}
        onEdit={(u) => {
          setSelectedUser(u);
          setOpenForm(true);
        }}
        onDelete={(id) => setDeleteId(id)}
      />

      <UserForm
        open={openForm}
        user={selectedUser}
        onClose={() => setOpenForm(false)}
        onSubmit={handleSubmit}
      />

      {/* Delete Confirmation */}
      <Dialog open={Boolean(deleteId)} onClose={() => setDeleteId(null)}>
        <DialogContent>
          <Typography>{t('user_delete_confirm')}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>{t('cancel')}</Button>
          <Button color="error" onClick={handleDelete} variant="contained">
            {t('delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
