import { Layout, Typography, Card } from "antd";
import Header from "../components/Header";

const { Content } = Layout;
const { Title, Paragraph } = Typography;

export default function Start() {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header />

      <Content
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "40px",
          background: "#f5f5f5",
        }}
      >
        <Card
          style={{
            maxWidth: 600,
            width: "100%",
            textAlign: "center",
            padding: "40px 20px",
            borderRadius: "16px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <Title level={3}>Добро пожаловать 👋</Title>
          <Paragraph style={{ fontSize: "16px", color: "#555" }}>
            Приветствуем Вас! <br />
            Выберите раздел, в котором хотите работать.
          </Paragraph>
        </Card>
      </Content>
    </Layout>
  );
}
