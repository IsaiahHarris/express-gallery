exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('arts')
    .del()
    .then(function() {
      // Inserts seed entries
      return knex('arts').insert([
        {
          author: 'Bacon God 808',
          link: '/arts/{{id}}',
          description:
            'Bacon ipsum dolor amet prosciutto pig sausage, porchetta meatloaf turkey pork kielbasa pork chop tenderloin ribeye strip steak burgdoggen. Frankfurter cupim pancetta, boudin tri-tip filet mignon pork chop cow beef pig pork brisket burgdoggen spare ribs. '
        },
        {
          author: 'Lionel',
          link: '/arts/{{id}}',
          description:
            'Upper 90 World Cup ball number 10 halftime red card chip midfielder referee African Cup of Nations hat trick UEFA European Championship. Red card three-five-two brace midfielder chip yellow card hat trick goal number 10'
        },
        {
          author: 'G.E.T.O',
          link: '/arts/{{id}}',
          description:
            'Lorizzle dang nizzle bling bling amet, nizzle adipiscing elit. Nullizzle sapien velit, da bomb volutpizzle, suscipizzle things, gravida vizzle, arcu. Mammasay mammasa mamma oo sa egizzle tortor. Sizzle erizzle. Brizzle fo shizzle my nizzle dolizzle shiznit dope tempizzle uhuh ... yih!. '
        }
      ]);
    });
};
