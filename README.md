hubot-mtg
=========

A collection of hubot scripts for querying for Magic the Gathering cards.

## Commands

All the commands begin with `<hubot_name> mtg`. `<hubot_name> magic` will also work.


### Show

Display an MtG card.

```
hubot (magic|mtg) <name>

# example
hubot mtg Tamiyo, Field
```

### Transform

Display the reverse side of an MtG card.

```
hubot (magic|mtg) (transform|flip) <name>

# examples
hubot mtg transform jace, vryn # get transformed Jace
hubot mtg flip Brisella, voice of # get both unmelded cards
hubot mtg flip Food Chain # just a normal magic back
```

### Price

Get the price in USD and MtGO tickets for an MtG card.

```
hubot (magic|mtg) (price|$) <name>

# examples
hubot mtg price Rekindling Phoen
hubot mtg $ Karn, Scion
```

### Query

A [Scryfall API query](https://scryfall.com/docs/reference) that will return 5 cards and a link to any additional cards.

```
hubot (magic|mtg) query <search term>

# examples
hubot mtg query o:vigilance ids:bant # any cards that have vigilance in their oracle text and have a color identity of white|green|blue
```

### Rulings

Get the rulings for a particular card.

```
hubot (magic|mtg) rulings <name>

# examples
hubot mtg rulings jadelight ranger
```

### Spoilers

Get ongoing spoilers for cards in a particular set. If no set code is provided, the most recent set will be used. Spoilers are fetched every fifteen minutes and the feed will automatically stop after 24 hours with no new spoilers. 

To stop all spoilers, use `cancel` for the set code.

```
hubot (magic|mtg) spoilers [<set code>] 
hubot (magic|mtg) spoilers cancel

# examples
hubot mtg spoilers # start spoiler polling for the latest set
hubot mtg spoilers dom # start spoiler polling for Dominaria
hubot mtg spoilers cancel # stop all spoiler polling in all rooms
```
