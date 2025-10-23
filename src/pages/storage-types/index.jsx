import { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import { Iconify } from 'src/components/iconify';
import { DashboardContent } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { storageService } from 'src/services/api';
import { paths } from 'src/routes/paths';

export default function StorageTypesPage() {
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter state
  const [filters, setFilters] = useState({ name: '', type: '' });

  useEffect(() => {
    async function fetchTypes() {
      setLoading(true);
      try {
        const res = await storageService.getStorageCategories();
        setTypes(Array.isArray(res?.data) ? res.data : []);
      } catch (e) {
        setTypes([]);
      }
      setLoading(false);
    }
    fetchTypes();
  }, []);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editType, setEditType] = useState(null); // null for add, object for edit
  const [form, setForm] = useState({ name: '', type: '', isVehicle: false });
  const [deleteId, setDeleteId] = useState(null);
  const [subcategories, setSubcategories] = useState([]); // For dialog subcategory editing
  const [subDialogOpen, setSubDialogOpen] = useState(false);
  const [editSub, setEditSub] = useState(null); // null for add, object for edit
  const [subForm, setSubForm] = useState({ title: '', description: '' });

  // Filtering logic
  const filteredTypes = types.filter((type) => {
    const nameMatch = filters.name ? type.name.toLowerCase().includes(filters.name.toLowerCase()) : true;
    const typeMatch = filters.type ? type.type.toLowerCase().includes(filters.type.toLowerCase()) : true;
    return nameMatch && typeMatch;
  });

  const isFiltered = filters.name.trim() !== '' || filters.type.trim() !== '';

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleResetFilters = () => {
    setFilters({ name: '', type: '' });
  };

  const handleOpenAdd = () => {
    setEditType(null);
    setForm({ name: '', type: '', isVehicle: false });
    setSubcategories([]);
    setDialogOpen(true);
  };

  const handleOpenEdit = (type) => {
    setEditType(type);
    setForm({ name: type.name, type: type.type, isVehicle: type.isVehicle });
    setSubcategories(Array.isArray(type.subcategory) ? type.subcategory : []);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditType(null);
    setSubcategories([]);
  };

  const handleFormChange = (e) => {
    const { name, value, type: inputType, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: inputType === 'checkbox' ? checked : value,
    }));
  };

  const [errorMsg, setErrorMsg] = useState('');
  const handleSave = async () => {
    setErrorMsg('');
    try {
      // Only send allowed fields
      const payload = {
        name: form.name,
        type: form.type,
        isVehicle: form.isVehicle,
        subcategory: form.isVehicle
          ? subcategories.map((s) => ({
              title: s.title,
              description: s.description,
            }))
          : [],
      };
      let result;
      if (editType) {
        result = await storageService.updateStorageCategory(editType._id || editType.id, payload);
      } else {
        result = await storageService.createStorageCategory(payload);
      }
      // Refresh list
      const res = await storageService.getStorageCategories();
      setTypes(Array.isArray(res?.data) ? res.data : []);
      handleCloseDialog();
    } catch (e) {
      setErrorMsg(e?.message || 'Failed to save. Please check your permissions and try again.');
    }
  };

  const handleDelete = async (id) => {
    setDeleteId(id);
    try {
      await storageService.deleteStorageCategory(id);
      const res = await storageService.getStorageCategories();
      setTypes(Array.isArray(res?.data) ? res.data : []);
    } catch (e) {
      // Optionally show error
    }
    setDeleteId(null);
  };

  // Subcategory CRUD for dialog
  const handleOpenAddSub = () => {
    setEditSub(null);
    setSubForm({ title: '', description: '' });
    setSubDialogOpen(true);
  };
  const handleOpenEditSub = (sub) => {
    setEditSub(sub);
    setSubForm({ title: sub.title, description: sub.description });
    setSubDialogOpen(true);
  };
  const handleCloseSubDialog = () => {
    setEditSub(null);
    setSubDialogOpen(false);
    setSubForm({ title: '', description: '' });
  };
  const handleSubFormChange = (e) => {
    const { name, value } = e.target;
    setSubForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleSaveSub = () => {
    if (editSub) {
      // Edit
      setSubcategories((prev) =>
        prev.map((s) => (s._id === editSub._id ? { ...s, ...subForm } : s))
      );
    } else {
      // Add
      setSubcategories((prev) => [
        ...prev,
        { ...subForm, _id: Math.random().toString(36).slice(2) },
      ]);
    }
    handleCloseSubDialog();
  };
  const handleDeleteSub = (id) => {
    setSubcategories((prev) => prev.filter((s) => s._id !== id));
  };

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Storage Types"
        links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'Storage Types' }]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      {/* Filter Bar */}
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
        <TextField
          label="Filter by Name"
          name="name"
          value={filters.name}
          onChange={handleFilterChange}
          size="small"
        />
        <TextField
          label="Filter by Type"
          name="type"
          value={filters.type}
          onChange={handleFilterChange}
          size="small"
        />
        {isFiltered && (
          <Button onClick={handleResetFilters} color="inherit" size="small">Clear</Button>
        )}
        {isFiltered && (
          <Typography variant="body2" sx={{ ml: 1, color: 'text.secondary' }}>{filteredTypes.length} results</Typography>
        )}
      </Box>
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell width={60} align="center">
                  <Iconify icon="mdi:format-list-bulleted" sx={{ color: 'text.secondary' }} />
                </TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Is Vehicle</TableCell>
                <TableCell>Subcategories</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : filteredTypes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No storage types found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredTypes.map((type) => (
                  <TableRow key={type._id || type.id}>
                    <TableCell align="center">
                      <Iconify icon="mdi:format-list-bulleted" sx={{ color: 'text.secondary' }} />
                    </TableCell>
                    <TableCell>{type.name}</TableCell>
                    <TableCell>{type.type}</TableCell>
                    <TableCell>{type.isVehicle ? 'Yes' : 'No'}</TableCell>
                    <TableCell>
                      {type.isVehicle &&
                      Array.isArray(type.subcategory) &&
                      type.subcategory.length > 0 ? (
                        <Box>
                          {type.subcategory.map((sub) => (
                            <Box key={sub._id} sx={{ mb: 0.5 }}>
                              <Typography variant="subtitle2">{sub.title}</Typography>
                              {sub.description && (
                                <Typography variant="body2" color="text.secondary">
                                  {sub.description}
                                </Typography>
                              )}
                            </Box>
                          ))}
                        </Box>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <IconButton color="primary" onClick={() => handleOpenEdit(type)}>
                          <Iconify icon="solar:pen-bold" />
                        </IconButton>
                        <IconButton color="error" onClick={() => handleDelete(type._id || type.id)}>
                          <Iconify icon="solar:trash-bin-trash-bold" />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editType ? 'Edit Storage Type' : 'Add New Storage Type'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            {errorMsg && (
              <Typography color="error" variant="body2">
                {errorMsg}
              </Typography>
            )}
            <TextField
              label="Name"
              name="name"
              value={form.name}
              onChange={handleFormChange}
              fullWidth
            />
            <TextField
              label="Type"
              name="type"
              value={form.type}
              onChange={handleFormChange}
              fullWidth
            />
            <Box>
              <input
                type="checkbox"
                name="isVehicle"
                checked={form.isVehicle}
                onChange={handleFormChange}
                style={{ marginRight: 8 }}
              />
              Is Vehicle
            </Box>
            {form.isVehicle && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Subcategories
                </Typography>
                <Stack spacing={1}>
                  {subcategories.map((sub) => (
                    <Box key={sub._id} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle2">{sub.title}</Typography>
                        {sub.description && (
                          <Typography variant="body2" color="text.secondary">
                            {sub.description}
                          </Typography>
                        )}
                      </Box>
                      <IconButton color="primary" onClick={() => handleOpenEditSub(sub)}>
                        <Iconify icon="solar:pen-bold" />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDeleteSub(sub._id)}>
                        <Iconify icon="solar:trash-bin-trash-bold" />
                      </IconButton>
                    </Box>
                  ))}
                  <Button size="small" variant="outlined" onClick={handleOpenAddSub} sx={{ mt: 1 }}>
                    Add Subcategory
                  </Button>
                </Stack>
              </Box>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            {editType ? 'Save Changes' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Subcategory Add/Edit Dialog */}
      <Dialog open={subDialogOpen} onClose={handleCloseSubDialog} maxWidth="xs" fullWidth>
        <DialogTitle>{editSub ? 'Edit Subcategory' : 'Add Subcategory'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Title"
              name="title"
              value={subForm.title}
              onChange={handleSubFormChange}
              fullWidth
            />
            <TextField
              label="Description"
              name="description"
              value={subForm.description}
              onChange={handleSubFormChange}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSubDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveSub}>
            {editSub ? 'Save Changes' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardContent>
  );
}
