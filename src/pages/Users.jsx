import { useState, useEffect } from "react";
import { Layout } from "antd";

import Header from "../components/Header";
import UsersTable from "../features/users/components/UsersTable";

const { Content } = Layout;

export default function Users() {
  return (
    <Layout>
      <Header/>

      <Content>
        <UsersTable/>
      </Content>

    </Layout>
  );
}
