import { useState, useEffect } from "react";
import { Table, Card, Button, Spin, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useGetAllUsersQuery } from "../usersApi";
import { useGetAddressesWithoutUsersQuery } from "../../addresses/addressesApi";
import UserEditModal from "./UserEditModal";
import UserCreateModal from "./UserCreateModal";
import UserActions from "./UserActions";
import tableColumns from "./tableColumns";

export default function UsersTable() {
  const [messageApi, contextHolder] = message.useMessage();
  const [users, setUsers] = useState([]);
  const [editingKey, setEditingKey] = useState("");
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);

  const {
    data: arrayUsers,
    isLoading,
    isFetching,
    isError,
  } = useGetAllUsersQuery();

  const { data: arrayAddressesWithoutUsers } =
    useGetAddressesWithoutUsersQuery();

  useEffect(() => {
    if (arrayUsers?.length > 0) {
      const usersWithKey = arrayUsers.map((item) => ({
        ...item,
        key: item.id || Math.random().toString(36).substr(2, 9),
        birthDateFormatted: item.birthDate
          ? dayjs(item.birthDate).format("DD.MM.YYYY")
          : "",
      }));
      setUsers(usersWithKey);
    }
  }, [arrayUsers, isLoading, isFetching, isError]);

  const handleEdit = (record) => {
    setEditingKey(record.key);
    setCurrentRecord(record);
    setIsEditModalVisible(true);
  };

  const handleCreate = () => {
    setIsCreateModalVisible(true);
  };

  const handleCancelEdit = () => {
    setEditingKey("");
    setCurrentRecord(null);
    setIsEditModalVisible(false);
  };

  const handleCancelCreate = () => {
    setIsCreateModalVisible(false);
  };

  const handleDeleteSuccess = (recordKey) => {
    setUsers((prev) => prev.filter((item) => item.key !== recordKey));
    messageApi.success("Пользователь успешно удален");
  };

  const handleUpdateSuccess = () => {
    messageApi.success("Пользователь успешно обновлен");
    handleCancelEdit();
  };

  const handleCreateSuccess = () => {
    messageApi.success("Пользователь успешно создан");
    handleCancelCreate();
  };

  const columnsWithActions = tableColumns.map((col) => {
    if (col.key === "actions") {
      return {
        ...col,
        render: (_, record) => (
          <UserActions
            record={record}
            editingKey={editingKey}
            onEdit={handleEdit}
            onDeleteSuccess={() => handleDeleteSuccess(record.key)}
          />
        ),
      };
    }
    return col;
  });

  if (isLoading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (isError) {
    return (
      <div style={{ textAlign: "center", padding: "50px", color: "red" }}>
        Ошибка загрузки данных
      </div>
    );
  }

  return (
    <>
      {contextHolder}
      <Card
        title="Пользователи"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            Добавить пользователя
          </Button>
        }
      >
        <Table
          dataSource={users}
          columns={columnsWithActions}
          loading={isFetching}
          pagination={{ pageSize: 10, showSizeChanger: true }}
          scroll={{ x: 1200 }}
          rowKey="id"
        />
      </Card>

      <UserEditModal
        visible={isEditModalVisible}
        record={currentRecord}
        onCancel={handleCancelEdit}
        onSuccess={handleUpdateSuccess}
      />

      <UserCreateModal
        visible={isCreateModalVisible}
        onCancel={handleCancelCreate}
        onSuccess={handleCreateSuccess}
        addressesWithoutUsers={arrayAddressesWithoutUsers}
      />
    </>
  );
}
