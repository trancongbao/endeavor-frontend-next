import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Drawer } from "@mui/material";
import SchoolIcon from '@mui/icons-material/School';
import LegendToggleIcon from "@mui/icons-material/LegendToggle";

export function SideBar() {
  return (
    <Drawer
      sx={{
        width: 240,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 240,
          boxSizing: "border-box",
          backgroundColor: "rgb(71 85 105)",
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <List>
        {[
          {
            title: "Courses",
            icon: <SchoolIcon />,
          },
          {
            title: "Decks",
            icon: <LegendToggleIcon />,
          },
        ].map(({ title, icon }, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton>
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText primary={title} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}
