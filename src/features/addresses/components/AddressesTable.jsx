import { useState, useEffect } from "react";
import { Table, Card, Button, Spin, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useGetAllAddressesQuery } from "../addressesApi";
import AddressEditModal from "./AddressEditModal";
import AddressCreateModal from "./AddressCreateModal";
import AddressActions from "./AddressActions";
import columns from "./tableColumns";

export default function AddressesTable() {
  const [messageApi, contextHolder] = message.useMessage();
  const [addresses, setAddresses] = useState([]);
  const [editingKey, setEditingKey] = useState("");
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);

  const {
    data: arrayAddresses,
    isLoading,
    isFetching,
    isError,
  } = useGetAllAddressesQuery();

  useEffect(() => {
    if (arrayAddresses?.length > 0) {
      const addressesWithKey = arrayAddresses.map((item) => ({
        ...item,
        key: item.id || Math.random().toString(36).substr(2, 9),
      }));
      setAddresses(addressesWithKey);
    }
  }, [arrayAddresses]);

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

  const tableColumns = columns.map((col) => {
    if (col.key === "actions") {
      return {
        ...col,
        render: (_, record) => (
          <AddressActions
            record={record}
            editingKey={editingKey}
            onEdit={handleEdit}
            onDelete={() => {
              setAddresses((prev) =>
                prev.filter((item) => item.key !== record.key)
              );
              messageApi.success("Адрес успешно удален");
            }}
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
        title="Адреса"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            Добавить адрес
          </Button>
        }
      >
        <Table
          dataSource={addresses}
          columns={tableColumns}
          loading={isFetching}
          pagination={{ pageSize: 10, showSizeChanger: true }}
          scroll={{ x: 1000 }}
          rowKey="id"
        />
      </Card>

      <AddressEditModal
        visible={isEditModalVisible}
        record={currentRecord}
        onCancel={handleCancelEdit}
        onSuccess={() => {
          messageApi.success("Адрес успешно обновлен");
          handleCancelEdit();
        }}
      />

      <AddressCreateModal
        visible={isCreateModalVisible}
        onCancel={handleCancelCreate}
        onSuccess={() => {
          messageApi.success("Адрес успешно создан");
          handleCancelCreate();
        }}
      />
    </>
  );
}
