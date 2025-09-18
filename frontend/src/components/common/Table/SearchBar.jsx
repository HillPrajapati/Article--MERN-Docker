import React, { memo } from "react";
import { Box, TextField, Button, InputAdornment } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";

const SearchBar = ({ query, setQuery, onAdd, searchPlaceHolder }) => {
  const handleChange = (e) => setQuery(e.target.value);

  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" gap={2} mb={2}>
      <TextField
        placeholder={searchPlaceHolder || "Search..."}
        value={query}
        onChange={handleChange}
        size="small"
        fullWidth
        variant="outlined"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
        }}
        sx={{
          borderRadius: 2,
          "& .MuiOutlinedInput-root": {
            borderRadius: 2,
          },
        }}
      />

      {typeof onAdd === "function" && (
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={onAdd}
          sx={{ borderRadius: 2, whiteSpace: "nowrap" }}
        >
          + Add
        </Button>
      )}
    </Box>
  );
};

export default memo(SearchBar);
