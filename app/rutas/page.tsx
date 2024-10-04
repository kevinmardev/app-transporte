"use client";
import React, { useState } from "react";
import { Pagination, Table, Typography } from "antd";

const { Title } = Typography;

export default function pageRutas() {
  console.log(process.env.NEXT_PUBLIC_FIREBASE_API_KEY);

  interface PaginatedTableProps {
    columns: object[];
    data: object[];
    total: number;
    idKey: string;
    pageSizeOptions?: string[]; // Opcional, por si quieres cambiar los tamaños de página disponibles
  }
  const PaginatedTable: React.FC<PaginatedTableProps> = ({
    columns,
    data,
    total,
    pageSizeOptions = ["10", "20", "30", "40"], // Valores por defecto
    idKey,
  }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // Manejador de cambios en la paginación
    const handlePaginationChange = (page: number, pageSize?: number) => {
      setCurrentPage(page);
      if (pageSize) {
        setPageSize(pageSize);
      }
      // fetchData(page, pageSize || 10);
    };

    return (
      <div>
        <Title level={2}>Lista de Rutas</Title>

        <Table
          dataSource={data}
          columns={columns}
          pagination={false} // Deshabilitamos la paginación automática de Ant Design
          rowKey={idKey} // Asumimos que cada fila tiene una key o id único
        />
        <Pagination
          style={{ marginTop: "1rem" }}
          current={currentPage}
          pageSize={pageSize}
          total={total}
          onChange={handlePaginationChange}
          showSizeChanger
          pageSizeOptions={pageSizeOptions}
          onShowSizeChange={handlePaginationChange}
          showTotal={(total) => `Total ${total} items`} // Mostrar el total de registros
        />
      </div>
    );
  };
}
