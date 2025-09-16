import React from 'react';
import { Pagination as MuiPagination, Box, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalElements: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

function Pagination({
  currentPage,
  totalPages,
  pageSize,
  totalElements,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  const startItem = currentPage * pageSize + 1;
  const endItem = Math.min((currentPage + 1) * pageSize, totalElements);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mt: 3,
        flexWrap: 'wrap',
        gap: 2,
      }}
    >
      <Typography variant="body2" color="text.secondary">
        Showing {startItem}-{endItem} of {totalElements} items
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Items per page</InputLabel>
          <Select
            value={pageSize}
            label="Items per page"
            onChange={(e) => onPageSizeChange(e.target.value as number)}
          >
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={50}>50</MenuItem>
          </Select>
        </FormControl>

        <MuiPagination
          count={totalPages}
          page={currentPage + 1}
          onChange={(_, page) => onPageChange(page - 1)}
          color="primary"
          showFirstButton
          showLastButton
        />
      </Box>
    </Box>
  );
}

export default Pagination;