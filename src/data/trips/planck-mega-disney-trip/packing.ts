import type { TripPackingData } from '../../../lib/trips/types';

export const planckMegaDisneyTripPacking: TripPackingData = {
  categories: [
    {
      category: 'For the kids',
      archetypes: ['kids'],
      kidsOnly: true,
      items: [
        {
          name: 'Stroller',
          priority: 'must',
        },
        {
          name: 'Change of clothes in a zip bag',
          priority: 'must',
        },
        {
          name: 'Water bottle',
          priority: 'must',
        },
        {
          name: "Children's Motrin and Tylenol",
          priority: 'must',
        },
        {
          name: 'Themometer of your choice',
          priority: 'rec',
        },
        {
          name: 'Snacks',
          priority: 'rec',
        },
        {
          name: 'Ear protection',
          priority: 'rec',
        },
        {
          name: 'Stroller fan and rain cover',
          priority: 'rec',
        },
        {
          name: 'Diaper bag, diapers and wipes',
          priority: 'must',
        },
        {
          name: 'Pacifiers and clip',
          priority: 'rec',
        },
        {
          name: 'Boogie wipes and antibacterial wipes',
          priority: 'rec',
        },
        {
          name: 'Light blanket and warm hat',
          priority: 'rec',
        },
        {
          name: 'Diaper rash cream',
          priority: 'rec',
        },
        {
          name: 'Small toys',
          priority: 'nice',
        },
        {
          name: 'Bib and child-sized eating utensils',
          priority: 'rec',
        },
        {
          name: 'Dirty clothes bags',
          priority: 'rec',
        },
        {
          name: 'Aquaphor / Vaseline',
          priority: 'rec',
        },
      ],
    },
    {
      category: 'Baby travel and sleep',
      archetypes: ['kids'],
      kidsOnly: true,
      items: [
        {
          name: 'Baby carrier',
          priority: 'rec',
        },
        {
          name: 'SlumberPod',
          priority: 'nice',
        },
        {
          name: 'Sleep sack',
          priority: 'rec',
        },
        {
          name: 'Sound machines and chargers',
          priority: 'rec',
        },
        {
          name: 'Baby monitor and charger',
          priority: 'rec',
        },
        {
          name: 'Nursing cover',
          priority: 'nice',
        },
        {
          name: 'Pump and bottle supplies',
          priority: 'rec',
        },
        {
          name: 'Vitamin drops',
          priority: 'rec',
        },
        {
          name: 'Baby body wash and detergent',
          priority: 'rec',
        },
        {
          name: 'Swim diapers',
          priority: 'rec',
        },
      ],
    },
    {
      category: 'Park day bag',
      archetypes: ['adults', 'kids'],
      items: [
        {
          name: 'Phone',
          priority: 'must',
        },
        {
          name: 'Portable battery and cable',
          priority: 'must',
        },
        {
          name: 'MagicBand or phone wallet pass',
          priority: 'must',
        },
        {
          name: 'Sunscreen, SPF 30 or higher',
          priority: 'must',
        },
        {
          name: 'Water bottle',
          priority: 'rec',
        },
        {
          name: 'Small crossbody bag',
          priority: 'rec',
        },
        {
          name: 'Rain poncho',
          priority: 'nice',
        },
      ],
    },
    {
      category: 'Clothing',
      archetypes: ['adults', 'kids'],
      items: [
        {
          name: 'Broken-in walking shoes',
          priority: 'must',
        },
        {
          name: 'Light layer for evenings',
          priority: 'must',
        },
        {
          name: '2 extra pair of socks',
          priority: 'rec',
        },
        {
          name: 'An extra pair of walking shoes',
          priority: 'rec',
        },
        {
          name: 'Ears or matching outfits',
          priority: 'nice',
        },
        {
          name: 'Park and non-park outfits',
          priority: 'must',
        },
        {
          name: 'Underwear and bras',
          priority: 'must',
        },
        {
          name: 'Hat and sunglasses',
          priority: 'rec',
        },
        {
          name: 'Swimsuit and coverup',
          priority: 'rec',
        },
        {
          name: 'Flip flops or pool sandals',
          priority: 'rec',
        },
        {
          name: 'Workout outfits',
          priority: 'nice',
        },
      ],
    },
    {
      category: 'Health and comfort',
      archetypes: ['adults', 'kids'],
      items: [
        {
          name: 'Blister kit or bandaids',
          priority: 'must',
        },
        {
          name: 'Pain relievers',
          priority: 'must',
        },
        {
          name: 'Hand sanitizer',
          priority: 'rec',
        },
        {
          name: 'Cooling towel',
          priority: 'nice',
        },
        {
          name: 'Cosmetics and toiletries',
          priority: 'must',
        },
        {
          name: 'Antacid',
          priority: 'nice',
        },
        { name: 'Body Glide / anti-chafe', priority: 'rec' },
        { name: 'Gold Bond / powder', priority: 'rec' },
      ],
    },
    {
      category: 'Travel and room essentials',
      archetypes: ['adults', 'kids'],
      items: [
        {
          name: 'Device chargers and spare batteries',
          priority: 'must',
        },
      ],
    },
  ],
};
