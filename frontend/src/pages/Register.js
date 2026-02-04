import React, { useState } from "react";
import { Container, Paper, Typography, TextField, Button, Box, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();

  const submit = async () => {
    setErrorMsg("");

    if (!form.name || !form.email || !form.password) {
      setErrorMsg(t('all_fields_required'));
      return;
    }

    try {
      setLoading(true);
      await api.post("/auth/register", form);
      alert(t('account_created_success'));
      navigate("/login");
    } catch (err) {
      setErrorMsg(err.response?.data?.message || t('register_failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5", display: "flex", alignItems: "center", py: 4 }}>
      <Container maxWidth="sm">
        <Box sx={{ mb: 2 }}>
          <IconButton onClick={() => navigate("/login")} sx={{ mb: 1 }}>
            <ArrowBackIcon /> {t('back')}
          </IconButton>
        </Box>
        <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, textAlign: "center" }}>
            {t('create_account_title')}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: "center" }}>
            {t('create_account_subtitle')}
          </Typography>

          {errorMsg && (
            <Box sx={{ mb: 2, p: 1.5, bgcolor: "#ffebee", borderRadius: 1, border: "1px solid #ef5350" }}>
              <Typography variant="body2" sx={{ color: "#c62828", textAlign: "center" }}>
                {errorMsg}
              </Typography>
            </Box>
          )}

          <Box mt={2}>
            <TextField
              fullWidth
              label={t('full_name_label')}
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label={t('email_label')}
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label={t('password_label')}
              type="password"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              sx={{ mb: 3 }}
            />
            <Button
              variant="contained"
              fullWidth
              onClick={submit}
              disabled={loading}
              sx={{ py: 1.5, borderRadius: 2, fontSize: "1rem", fontWeight: 600 }}
            >
              {loading ? t('creating') : t('signup_button')}
            </Button>
            <Button
              fullWidth
              variant="text"
              sx={{ mt: 2 }}
              onClick={() => navigate("/login")}
            >
              {t('already_have_account')}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
