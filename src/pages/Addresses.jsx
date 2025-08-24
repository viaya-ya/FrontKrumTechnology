import { useState, useEffect } from "react";
import { Layout } from "antd";

import Header from "../components/Header";
import AddressesTable from "../features/addresses/components/AddressesTable";

const { Content } = Layout;

export default function Addresses() {
  return (
    <Layout>
      <Header/>

      <Content>
        <AddressesTable/>
      </Content>

    </Layout>
  );
}
