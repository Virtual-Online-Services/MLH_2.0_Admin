
export const menu = [
  
  {
    id: 1,
    title: "General",
    listItems: [
      {
        id: 1,
        title: "Dashboard",
        url: "/home",
        icon: "fa fa-user",
        permission: "transaction",
      },
      {
        id: 2,
        title: "Message",
        url: "/all-message",
        icon: "fa fa-envelope-o",
        permission: "message",
      },
      {
        id: 3,
        title: "Message User",
        url: "/single-user-message",
        icon: "fa fa-envelope-o",
         permission: "message",
      },
      {
        id: 4,
        title: "Advert",
        url: "/advert",
        icon: "fa fa-picture-o",
        permission: "advert",
      },
      {
        id: 5,
        title: "User",
        url: "/users",
        icon: "fa fa-users",
        permission: "user",
      },
      {
        id: 6,
        title: "Transactions",
        url: "/all-transactions",
        icon: "fa fa-american-sign-language-interpreting",
        permission: "transaction",
      },
      {
        id: 7,
        title: "Withdrawals",
        url: "/all-withdraw",
        icon: "fa fa-cloud-download",
        permission: "transaction",
      },
      {
        id: 8,
        title: "Admin",
        url: "/register-admin",
        icon: "fa fa-buysellads",
        permission: "user",
      },

      {
        id: 10,
        title: "Profile",
        url: "/admin-profile",
        icon: "fa fa-user",
        permission: "user",
      },
      {
        id: 11,
        title: "Password",
        url: "/reset-password",
        icon: "fa fa-lock",
        permission: "user",
      },
    ],
  },
  {
    id: 2,
    title: "Lotto",
    listItems: [
      {
        id: 2,
        title: "Operators",
        url: "/lotto-operator",
        icon: "fa fa-android",
        permission: "operator",
      },
      {
        id: 3,
        title: "Game",
        url: "/lotto-game",
        icon: "fa fa-gamepad",
        permission: "game",
      },
      {
        id: 4,
        title: "Results",
        url: "/results",
        icon: "fa fa-file",
        permission: "result",
      },

      {
        id: 8,
        title: "Play History",
        url: "/play-history",
        icon: "fa fa-play-circle-o",
        permission: "game",
      },
      {
        id: 9,
        title: "Bonus",
        url: "/bonus",
        icon: "fa fa-gift",
        permission: "game",
      },
    ],
  },
  {
    id: 3,
    title: "Agency",
    listItems: [
      {
        id: 1,
        title: "Commission",
        url: "/agent-commission",
        icon: "fa fa-balance-scale",
        permission: "operator",
      },
      {
        id: 2,
        title: "Transactions",
        url: "/agent-transaction",
        icon: "fa fa-american-sign-language-interpreting",
        permission: "transaction",
      },
      {
        id: 2,
        title: "Withdrawals",
        url: "/agent-withdraw",
        icon: "fa fa-money",
        permission: "transaction",
      },
      {
        id: 3,
        title: "Users",
        url: "/agent-users",
        icon: "fa fa-users",
        permission: "user",
      },
    ],
  },
  {
    id: 4,
    title: "Sports",
    listItems: [
      {
        id: 1,
        title: "Operators",
        url: "/sport-operator",
        icon: "fa fa-android",
        permission: "game",
      },
      {
        id: 3,
        title: "Forecasters",
        url: "/sport-forecast",
        icon: "fa fa-user",
        permission: "forecast",
      },
      {
        id: 2,
        title: "Affiliates",
        url: "/sport-affiliates",
        icon: "fa fa-at",
        permission: "game",
      },
      {
        id: 6,
        title: "Betting codes",
        url: "/sport-codes",
        icon: "fa fa-barcode",
        permission: "game",
      },

      {
        id: 7,
        title: "Sport Activity",
        url: "/sport-activity",
        icon: "fa fa-bolt",
        permission: "game",
      },
    ],
  },
  {
    id: 5,
    title: "Instant Games",
    listItems: [
      {
        id: 1,
        title: "Operators",
        url: "/instant-games-operator",
        icon: "fa fa-android",
        permission: "game",
      },
      {
        id: 2,
        title: "Game",
        url: "#",
        icon: "fa fa-gamepad",
        permission: "game",
      },
      {
        id: 3,
        title: "Instant Game Activity",
        url: "#",
        icon: "fa fa-bolt",
        permission: "game",
      },
    ],
  },

  {
    id: 8,
    title: "analytics",
    listItems: [
      {
        id: 1,
        title: "Activity Logs",
        url: "#",
        icon: "fa fa-bolt",
        permission: "user",
      },
    ],
  },
];

export const topDealUsers = [
  {
    id: 1,
    img: "https://images.pexels.com/photos/8405873/pexels-photo-8405873.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load",
    username: "5/90 Games-174,186",
    email: "elva@gmail.com",
    amount: "5/90 Games - 43",
  },
  {
    id: 2,
    img: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1600",
    username: "Baba Ijebu - 1,261,537",
    email: "linnie@gmail.com",
    amount: "Wesco - 13",
  },
  {
    id: 3,
    img: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=1600",
    username: "Wesco - 38,562",
    email: "brent@gmail.com",
    amount: "Golden Chance - 87",
  },
  {
    id: 4,
    img: "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=1600",
    username: "Golden Chance - 202,913",
    email: "adeline@gmail.com",
    amount: "Green lotto - 24",
  },
  {
    id: 5,
    img: "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=1600",
    username: "Green lotto - 107,651",
    email: "juan@gmail.com",
    amount: "Lottomania - 7",
  },
  {
    id: 6,
    img: "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=1600",
    username: "Lottomania - 35,297",
    email: "augusta@gmail.com",
    amount: "Set Lotto - 2",
  },
  {
    id: 7,
    img: "https://images.pexels.com/photos/874158/pexels-photo-874158.jpeg?auto=compress&cs=tinysrgb&w=1600",
    username: "Set Lotto - 41,174",
    email: "angel@gmail.com",
    amount: "",
  },
];

export const chartBoxRevenue = {
  color: "teal",
  icon: "/revenueIcon.svg",
  title: "Default Product",
  number: "No default product",
  dataKey: "revenue",
  percentage: 0,
  chartData: [
    { name: "Sun", product: 0 },
    { name: "Mon", product: 0 },
    { name: "Tue", product: 0 },
    { name: "Wed", product: 0 },
    { name: "Thu", product: 0 },
    { name: "Fri", product: 0 },
    { name: "Sat", product: 0 },
  ],
};

export const barChartBoxRevenue = {
  title: "Profit Earned",
  color: "#8884d8",
  dataKey: "profit",
  chartData: [
    {
      name: "Sun",
      profit: 4000,
    },
    {
      name: "Mon",
      profit: 3000,
    },
    {
      name: "Tue",
      profit: 2000,
    },
    {
      name: "Wed",
      profit: 2780,
    },
    {
      name: "Thu",
      profit: 1890,
    },
    {
      name: "Fri",
      profit: 2390,
    },
    {
      name: "Sat",
      profit: 3490,
    },
  ],
};

export const barChartBoxVisit = {
  title: "Total Visit",
  color: "#FF8042",
  dataKey: "visit",
  chartData: [
    {
      name: "Sun",
      visit: 4000,
    },
    {
      name: "Mon",
      visit: 3000,
    },
    {
      name: "Tue",
      visit: 2000,
    },
    {
      name: "Wed",
      visit: 2780,
    },
    {
      name: "Thu",
      visit: 1890,
    },
    {
      name: "Fri",
      visit: 2390,
    },
    {
      name: "Sat",
      visit: 3490,
    },
  ],
};
