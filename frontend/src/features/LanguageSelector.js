import React, { useState, useEffect } from 'react';
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography
} from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import i18n from 'i18next';
import { useTranslation } from 'react-i18next';

const LanguageSelector = () => {
  const { t } = useTranslation();
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    // Get initial language from localStorage or browser
    const savedLanguage = localStorage.getItem('language') || 
                         navigator.language.split('-')[0] || 
                         'en';
    setLanguage(savedLanguage);
    i18n.changeLanguage(savedLanguage);
  }, []);

  const changeLanguage = (lang) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' }
  ];

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <LanguageIcon sx={{ color: 'text.secondary' }} />
      <FormControl size="small" sx={{ minWidth: 120 }}>
        <Select
          value={language}
          onChange={(e) => changeLanguage(e.target.value)}
          displayEmpty
          sx={{ 
            '& .MuiSelect-select': { 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1 
            }
          }}
        >
          {languages.map((lang) => (
            <MenuItem key={lang.code} value={lang.code}>
              <span>{lang.flag}</span>
              <Typography variant="body2">{lang.name}</Typography>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default LanguageSelector;
