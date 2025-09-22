import React from 'react';
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
} from '@mui/material';

interface NavigationItemProps {
  text: string;
  icon: React.ReactNode;
  path: string;
  isActive: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export const NavigationItem: React.FC<NavigationItemProps> = ({
  text,
  icon,
  path,
  isActive,
  onClick,
  disabled = false,
}) => {
  const theme = useTheme();

  return (
    <ListItem disablePadding>
      <ListItemButton
        onClick={onClick}
        disabled={disabled}
        sx={{
          minHeight: 48,
          px: 2.5,
          backgroundColor: isActive ? theme.palette.primary.main : 'transparent',
          color: isActive ? theme.palette.primary.contrastText : 'inherit',
          '&:hover': {
            backgroundColor: isActive 
              ? theme.palette.primary.dark 
              : theme.palette.action.hover,
          },
          '&.Mui-disabled': {
            opacity: 0.6,
          },
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 0,
            mr: 3,
            justifyContent: 'center',
            color: isActive ? theme.palette.primary.contrastText : 'inherit',
          }}
        >
          {icon}
        </ListItemIcon>
        <ListItemText
          primary={text}
          sx={{
            opacity: 1,
            '& .MuiListItemText-primary': {
              fontSize: '0.875rem',
              fontWeight: isActive ? 600 : 400,
            },
          }}
        />
      </ListItemButton>
    </ListItem>
  );
};

export default NavigationItem;


