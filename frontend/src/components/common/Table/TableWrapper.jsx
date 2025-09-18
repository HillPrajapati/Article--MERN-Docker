import React, { useState, useEffect, useCallback } from "react";
import { Box, Paper } from "@mui/material";
import Loading from "../Loading.jsx";
import Error from "../Error.jsx";
import DataTable from "./DataTable.jsx";
import PaginationControls from "./PaginationControls.jsx";
import useDebounce from "../../../hooks/useDebounce.js";
import SearchBar from "./SearchBar.jsx"; // Use your existing SearchBar

const TableWrapper = ({ columns = [], fetchFn, pageSize = 10, actionsRenderer, onAdd, searchPlaceHolder }) => {
  const [rows, setRows] = useState([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(pageSize);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const debouncedQuery = useDebounce(query, 500);

  const load = useCallback(async (p = page, l = limit, q = debouncedQuery) => {
    try {
      setLoading(true);
      const res = await fetchFn({ q, page: p, limit: l });
      const payload = res.data?.data;

      if (payload) {
        setRows(payload.items || []);
        setTotal(payload.total || 0);
      } else {
        const items = res.data || [];
        setRows(items);
        setTotal(items.length);
      }
    } catch (e) {
      setErr(e.response?.data?.message || e.message || "Error loading");
    } finally {
      setLoading(false);
    }
  }, [fetchFn, debouncedQuery, page, limit]);

  useEffect(() => {
    load(1, limit, debouncedQuery);
  }, [debouncedQuery, limit, load]);

  const handlePageChange = useCallback((e, newPage) => {
    setPage(newPage);
    load(newPage, limit, debouncedQuery);
  }, [load, limit, debouncedQuery]);

  const handleLimitChange = useCallback((e) => {
    const newLimit = parseInt(e.target.value, 10);
    setLimit(newLimit);
    setPage(1);
    load(1, newLimit, debouncedQuery);
  }, [load, debouncedQuery]);

  return (
    <Paper elevation={4} sx={{ p: 3, borderRadius: 3, position: "relative" }}>
      {/* Search bar + Add button */}
      <SearchBar
        query={query}
        setQuery={setQuery}
        onAdd={onAdd}
        searchPlaceHolder={searchPlaceHolder}
      />

      {/* Table */}
      <Box position="relative">
        <DataTable columns={columns} rows={rows} actionsRenderer={actionsRenderer} />

        {loading && (
          <Box
            position="absolute"
            top={0}
            left={0}
            width="100%"
            height="100%"
            display="flex"
            justifyContent="center"
            alignItems="center"
            bgcolor="rgba(255,255,255,0.7)"
            sx={{ backdropFilter: "blur(2px)", borderRadius: 2 }}
            zIndex={10}
          >
            <Loading />
          </Box>
        )}
      </Box>

      {/* Pagination */}
      <PaginationControls
        page={page}
        total={total}
        limit={limit}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
      />

      {/* Error toast */}
      <Error message={err} />
    </Paper>
  );
};

export default TableWrapper;
