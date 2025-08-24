import { Layout, Menu, Space, Typography } from "antd";
import {
  UserOutlined,
  EnvironmentOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";

const { Header: AntHeader } = Layout;
const { Title } = Typography;

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: "/users",
      icon: <UserOutlined />,
      label: "Пользователи",
    },
    {
      key: "/addresses",
      icon: <EnvironmentOutlined />,
      label: "Адреса",
    },
  ];

  // Обработчик клика по меню
  const handleMenuClick = ({ key }) => {
    navigate(key);
  };

  return (
    <AntHeader
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        background: "#001529",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
      }}
    >
      {/* Логотип и название */}
      <Space>
        <div
          style={{
            width: 32,
            height: 32,
            background: "linear-gradient(45deg, #1890ff, #52c41a)",
            borderRadius: 6,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <MenuOutlined style={{ color: "white", fontSize: "16px" }} />
        </div>
        <Title
          level={3}
          style={{
            color: "white",
            margin: 0,
            cursor: "pointer",
            fontWeight: 600,
          }}
          onClick={() => navigate("/")}
        >
          Крымтехнологии
        </Title>
      </Space>

      {/* Навигационное меню */}
      <Menu
        theme="dark"
        mode="horizontal"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={handleMenuClick}
        style={{
          background: "transparent",
          border: "none",
          flex: 1,
          justifyContent: "center",
          minWidth: 0,
        }}
      />
    </AntHeader>
  );
}
