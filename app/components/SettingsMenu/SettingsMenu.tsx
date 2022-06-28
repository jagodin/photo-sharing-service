import { List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { useLocation, useNavigate } from '@remix-run/react';

interface MenuItem {
  selected: boolean;
  label: string;
  path: string;
}

export const SettingsMenu = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const menuItems: MenuItem[] = [
    {
      label: 'Edit Profile',
      path: '/account/edit',
      selected: pathname === '/account/edit',
    },
    {
      label: 'Change Password',
      path: '/account/password/change',
      selected: pathname === '/account/password/change',
    },
  ];

  return (
    <List disablePadding>
      {menuItems.map(({ selected, path, label }) => (
        <ListItem
          selected={selected}
          sx={(theme) => ({
            borderRadius: '3px 0 0 3px',
            '.Mui-selected': {
              '&:before': {
                content: '""',
                position: 'absolute',
                left: 0,
                width: 3,
                top: 0,
                height: '100%',
                backgroundColor: theme.palette.action.selected,
              },
            },
          })}
          key={label}
          disablePadding
        >
          <ListItemButton onClick={() => navigate(path)} selected={selected}>
            <ListItemText
              primaryTypographyProps={selected ? { fontWeight: 600 } : {}}
            >
              {label}
            </ListItemText>
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
};
