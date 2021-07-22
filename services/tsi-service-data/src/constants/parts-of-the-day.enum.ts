/**
 * Description: parts of the expresstions enum
 */

export enum PartsOfTheDay {
  Any = 'any-time',
  Morning = 'morning',
  Afternoon = 'afternoon',
  Evening = 'evening',
  Night = 'night',
}

export enum PartsOfTheDayTimePeriods {
  MorningStart = '00:00:00',
  MorningEnd = '12:00:00',
  AfternoonStart = '12:00:00',
  AfternoonEnd = '16:00:00',
  EveningStart = '16:00:00',
  EveningEnd = '20:00:00',
  NightStart = '20:00:00',
  NightEnd = '23:59:59',
}
