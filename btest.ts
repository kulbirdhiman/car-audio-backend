const data = {
    ConsignmentList: [
      {
        ConsignmentId: 100,
        ReceiverDetails: {
          ReceiverName: "XYZ Company1",
          AddressLine1: "work Sample Street",
          Suburb: "Parramatta ",
          Postcode: "2150",
          State: "NSW",
          ReceiverContactName: "JohnCitizen1",
          ReceiverContactMobile: "0404123333",
          ReceiverContactEmail: "receivercontact1@test.com.au",
        },
        ConsignmentLineItems: [
          {
            // "SenderLineReference": "ref line1",
            RateType: "ITEM",
            PackageDescription: "Carton of Goods",
            Items: 1,
            Kgs: 1,
            Length: 12,
            Width: 25,
            Height: 20,
            Cubic: 0.006,
          },
        ],
      },
    ],
  };
