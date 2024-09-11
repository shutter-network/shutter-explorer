export const drawerStyles = (drawerWidth: number) => ({
    width: drawerWidth,
    flexShrink: 0,
    [`& .MuiDrawer-paper`]: {
        width: drawerWidth,
        boxSizing: 'border-box',
    },
});

export const mainStyles = {
    flexGrow: 1,
    bgcolor: 'background.default',
    p: 3,
};
