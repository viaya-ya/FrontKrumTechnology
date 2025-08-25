const tableColumns = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    width: 60,
  },
  {
    title: "Имя",
    dataIndex: "firstName",
    key: "firstName",
  },
  {
    title: "Фамилия",
    dataIndex: "lastName",
    key: "lastName",
  },
  {
    title: "Отчество",
    dataIndex: "middleName",
    key: "middleName",
    render: (middleName) => middleName || "-",
  },
  {
    title: "Телефон",
    dataIndex: "phone",
    key: "phone",
    render: (phone) => phone || "-",
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
    render: (email) => email || "-",
  },
  {
    title: "Дата рождения",
    dataIndex: "birthDateFormatted",
    key: "birthDate",
    render: (date) => date || "-",
  },
  {
    title: "Адрес",
    dataIndex: ["address", "city"],
    key: "address",
    render: (city, record) =>
      record.address
        ? `${record.address.city}, ${record.address.street}`
        : "-",
  },
  {
    title: "Действия",
    key: "actions",
    width: 150,
    fixed: "right",
  },
];

export default tableColumns;