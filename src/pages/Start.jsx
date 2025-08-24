import { Layout } from "antd";

import Header from "../components/Header";

const { Content } = Layout;

export default function Start() {
  return (
    <Layout>
      <Header/>

      <Content>
          Приветсвуем Вас Выберите раздел в котором хотите работать
      </Content>

    </Layout>
  );
}
