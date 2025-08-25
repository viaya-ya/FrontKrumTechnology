const tableColumns = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    width: 60,
  },
  {
    title: "Регион",
    dataIndex: "region",
    key: "region",
  },
  {
    title: "Город",
    dataIndex: "city",
    key: "city",
  },
  {
    title: "Улица",
    dataIndex: "street",
    key: "street",
  },
  {
    title: "Дом",
    dataIndex: "house",
    key: "house",
  },
  {
    title: "Квартира",
    dataIndex: "apartment",
    key: "apartment",
    render: (apartment) => apartment || "-",
  },
  {
    title: "Действия",
    key: "actions",
    width: 150,
    fixed: "right",
  },
];

export default tableColumns;