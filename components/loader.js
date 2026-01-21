import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

const Loader = ({ open }) => {
  return (
    <Backdrop
      sx={{
        color: "#fff",
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: "rgba(0,0,0,0.6)",
      }}
      open={open}
    >
      <CircularProgress
        size={60}
        thickness={4}
        sx={{ color: "#C6A15B" }} // GOLD accent (or black)
      />
    </Backdrop>
  );
};

export default Loader;
