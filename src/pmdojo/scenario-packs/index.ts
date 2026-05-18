import { BAD_NEWS_EXTRA_SCENARIOS } from './lane01-bad-news'
import { ROOM_EXTRA_SCENARIOS } from './lane02-room'
import { CUTLINE_EXTRA_SCENARIOS } from './lane03-cutline'
import { EXEC_EXTRA_SCENARIOS } from './lane04-exec'
import { PRESSURE_TEST_EXTRA_SCENARIOS } from './lane05-pressure-test'

export const EXTRA_SCENARIOS = [
  ...BAD_NEWS_EXTRA_SCENARIOS,
  ...ROOM_EXTRA_SCENARIOS,
  ...CUTLINE_EXTRA_SCENARIOS,
  ...EXEC_EXTRA_SCENARIOS,
  ...PRESSURE_TEST_EXTRA_SCENARIOS,
]
