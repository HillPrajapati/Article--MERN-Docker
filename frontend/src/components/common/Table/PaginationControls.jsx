import React, { memo, useCallback } from "react";
import { Box, Typography, Select, MenuItem, Pagination } from "@mui/material";

const PaginationControls = ({ page, total, limit, onPageChange, onLimitChange }) => {
  const startIndex = (page - 1) * limit + 1;
  const endIndex = Math.min(page * limit, total);

  const handlePageChange = useCallback((e, value) => onPageChange(e, value), [onPageChange]);
  const handleLimitChange = useCallback((e) => onLimitChange(e), [onLimitChange]);

  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
      <Typography variant="body2">
        Showing {total === 0 ? 0 : startIndex}-{endIndex} of {total}
      </Typography>

      <Box display="flex" alignItems="center" gap={2}>
        <Typography variant="body2">Rows per page:</Typography>
        <Select size="small" value={limit} onChange={handleLimitChange}>
          {[5, 10, 20, 50].map((size) => (
            <MenuItem key={size} value={size}>{size}</MenuItem>
          ))}
        </Select>
        <Pagination
          count={Math.max(1, Math.ceil(total / limit))}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </Box>
  );
};

export default memo(PaginationControls);
