import type { TripPackingData } from '../../../lib/trips/types';

export const planckMegaDisneyTripPacking: TripPackingData = {
  categories: [
    {
      category: 'Kid diaper bag / stroller',
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
          name: 'Thermometer',
          priority: 'rec',
        },
        {
          name: 'Snacks',
          priority: 'rec',
        },
        {
          name: 'Child ear protective headphones',
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
      category: 'Kid packing list',
      archetypes: ['kids'],
      kidsOnly: true,
      items: [
        {
          name: 'Baby carrier',
          priority: 'rec',
        },
        {
          name: 'SlumberPod',
          priority: 'must',
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
          priority: 'must',
        },
        {
          name: 'Pump and bottle supplies',
          priority: 'nice',
        },
        {
          name: 'Vitamin drops',
          priority: 'rec',
        },
        {
          name: 'Baby body wash',
          priority: 'rec',
        },
        {
          name: 'Swim diapers',
          priority: 'rec',
        },
        {
          name: 'Stain remover',
          priority: 'rec',
        },
      ],
    },
    {
      category: 'Park day essentials',
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
        { name: 'Hat', priority: 'rec' },
        { name: 'Sunglasses', priority: 'must' },
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
          name: 'Four park day outfits',
          priority: 'must',
          details: [
            'Hollywood Studios: Toy Story or Star Wars',
            'Magic Kingdom: Anything Disney theme plus Christmas',
            'EPCOT: Ratatouille, Nemo, Frozen, or travel themed',
            'Animal Kingdom: Up, Wilderness Explorer, Lion King, or animal print',
          ],
        },
        {
          name: 'Special dining outfits',
          priority: 'must',
          details: [
            'Hoop-Dee-Doo Revue: Denim Night',
            "'Ohana: Hawaiian Shirts",
            "Chef Mickey's: Mickey and friends",
            'Wailulu Bar & Grill: Smart casual',
            "Narcoossee's: Smart casual",
          ],
        },
        {
          name: 'Additional resort day outfits (refer to Plan tab)',
          priority: 'must',
        },
        {
          name: 'Broken-in walking shoes',
          priority: 'must',
        },
        {
          name: 'Sweatshirt / Jacket',
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
          name: 'Ears or matching accessories',
          priority: 'nice',
        },
        {
          name: 'Underwear, bras, and socks',
          priority: 'must',
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
