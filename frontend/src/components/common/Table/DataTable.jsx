import React, { memo } from "react";
import { Table, TableHead, TableRow, TableCell, TableBody, Paper } from "@mui/material";

const DataTable = ({ columns, rows, actionsRenderer }) => (
  <Paper
    elevation={3}
    sx={{
      borderRadius: 2,
      overflow: "hidden",
      p: 2,
      mb: 2,
      bgcolor: "#fff",
    }}
  >
    <Table>
      <TableHead sx={{ bgcolor: "#f5f5f5" }}>
        <TableRow>
          {columns.map((c) => (
            <TableCell key={c.field} sx={{ fontWeight: "bold" }}>
              {c.title}
            </TableCell>
          ))}
          {actionsRenderer && <TableCell>Actions</TableCell>}
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.length > 0 ? (
          rows.map((row) => (
            <TableRow key={row._id} hover>
              {columns.map((c) => (
                <TableCell key={c.field}>{c.render ? c.render(row) : row[c.field] ?? ""}</TableCell>
              ))}
              {actionsRenderer && <TableCell>{actionsRenderer(row)}</TableCell>}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length + 1} align="center">
              No records found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </Paper>
);

export default memo(DataTable);
