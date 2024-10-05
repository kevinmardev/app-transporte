// app/layout.tsx
"use client";
import { Breadcrumb, Layout, Menu, theme } from "antd";
import Link from "next/link";
import { MenuProps } from "rc-menu";
import React, { useEffect, useState } from "react";

const { Header, Content, Footer } = Layout;

export default function MiLayout({ children }: { children: React.ReactNode }) {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const initialPage = localStorage.getItem("selectedPage") || "home";

  const [current, setCurrent] = useState(initialPage);

  const items = [
    { key: "1", label: <Link href="/">Home</Link> },
    { key: "2", label: <Link href="/conductor">Conductores</Link> },
    { key: "3", label: <Link href="/rutas">Rutas</Link> },
    { key: "4", label: <Link href="/vehiculos">Vehículos</Link> },
    { key: "5", label: <Link href="/viajes">Viajes</Link> },
  ];

  // Definir el tipo del evento onClick
  const handleMenuClick: MenuProps["onClick"] = (e) => {
    console.log("Item clicado: ", e.key); // e.key contiene la clave del ítem seleccionado
    setCurrent(e.key);
    localStorage.setItem("selectedPage", e.key); // Guardar la página seleccionada en localStorage
  };

  useEffect(() => {
    const savedPage = localStorage.getItem("selectedPage");
    if (savedPage) {
      setCurrent(savedPage);
    }
  }, []);

  return (
    <Layout>
      <Header style={{ display: "flex", alignItems: "center" }}>
        <div className="demo-logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[current]}
          items={items}
          onClick={handleMenuClick}
          style={{ flex: 1, minWidth: 0 }}
        />
      </Header>
      <Content style={{ padding: "0 48px" }}>
        <Breadcrumb style={{ margin: "16px 0" }}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>List</Breadcrumb.Item>
          <Breadcrumb.Item>App</Breadcrumb.Item>
        </Breadcrumb>
        <div
          style={{
            background: colorBgContainer,
            minHeight: 280,
            padding: 24,
            borderRadius: borderRadiusLG,
          }}
        >
          {children}
        </div>
      </Content>
      <Footer style={{ textAlign: "center" }}>
        Ant Design ©{new Date().getFullYear()} Created by Ant UED
      </Footer>
    </Layout>
  );
}
