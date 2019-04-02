module.exports = {
  harris: {
    destinations: [
      'maria',
      'bob',
      'joe',
    ],
    steps : [
        {
        presentTemplate: 'info',
        mobileTemplate: 'look-at-screen',
        text: 'The next day the rest of the family comes back and they spend the day making her as comfortable as possible. <br> They hold her hand and sing her the songs that she used to sing to them as children.<br>Later that night she passes away in her sleep.',
        image: 'maria-background.jpg',
      },
      {
        presentTemplate: 'info',
        mobileTemplate: 'look-at-screen',
        text: 'whatever2<br>asdf',
        image: 'image2.png',
      },
      {
        presentTemplate: 'present-decision',
        mobileTemplate: 'mobile-decision',
        resetResults: true,
        text: 'whatever2',
        image: 'image2.png',
        choices: [
          'make him stay',
          'do something else',
        ],
      },
      {
        presentTemplate: 'present-results',
        mobileTemplate: 'mobile-results',
        resetResults: true,
        text: 'whatever2',
        image: 'image2.png',
      },
    ],
  },
  maria: {
    destinations: [
      'maria',
      'bob',
      'joe',
    ],
    steps: [
      {
        presentTemplate: 'info',
        mobileTemplate: 'look-at-screen',
        text: 'whatever',
        image: 'image.png',
      },
      {
        presentTemplate: 'info',
        mobileTemplate: 'look-at-screen',
        text: 'whatever2',
        image: 'image2.png',
      },
      {
        presentTemplate: 'present-decision',
        mobileTemplate: 'mobile-decision',
        resetResults: true,
        text: 'whatever2',
        image: 'image2.png',
        choices: [
          'make him stay',
          'do something else',
        ],
      },
      {
        presentTemplate: 'present-results',
        mobileTemplate: 'mobile-results',
        resetResults: true,
        text: 'whatever2',
        image: 'image2.png',
      },
    ]
  },
  bob: {
    destinations: [
      'maria',
      'bob',
      'joe',
    ],
    steps : [
      {
        presentTemplate: 'info',
        mobileTemplate: 'look-at-screen',
        text: 'whatever',
        image: 'image.png',
      },
      {
        presentTemplate: 'info',
        mobileTemplate: 'look-at-screen',
        text: 'whatever2',
        image: 'image2.png',
      },
      {
        presentTemplate: 'present-decision',
        mobileTemplate: 'mobile-decision',
        resetResults: true,
        text: 'whatever2',
        image: 'image2.png',
      },
      {
        presentTemplate: 'present-results',
        mobileTemplate: 'mobile-results',
        resetResults: true,
        text: 'whatever2',
        image: 'image2.png',
      },
    ]
  },
  joe: {
    destinations: [
      'maria',
      'bob',
      'joe',
    ],
    steps: [
      {
        presentTemplate: 'info',
        mobileTemplate: 'look-at-screen',
        text: 'whatever',
        image: 'image.png',
      },
      {
        presentTemplate: 'info',
        mobileTemplate: 'look-at-screen',
        text: 'whatever2',
        image: 'image2.png',
      },
      {
        presentTemplate: 'present-decision',
        mobileTemplate: 'mobile-decision',
        resetResults: true,
        text: 'whatever2',
        image: 'image2.png',
        destinations: [
          'maria',
          'bob',
          'joe',
        ]
      },
      {
        presentTemplate: 'present-results',
        mobileTemplate: 'mobile-results',
        resetResults: true,
        text: 'whatever2',
        image: 'image2.png',
      },
    ],
  },
}
