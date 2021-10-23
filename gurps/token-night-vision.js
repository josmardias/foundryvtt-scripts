/*
 * FoundryVTT
 * https://foundryvtt.com/
 * Tested with
 *
 * GURPS Aid
 * https://foundryvtt.com/packages/gurps
 * Tested with 0.11.12
 *
 * Perfect Vision
 * https://foundryvtt.com/packages/perfect-vision
 *
 *
 * This script adds a Dim Vision to each selected token
 *
 * The idea is to limit the vision range of each token based
 *  on the Scene darkness level but at the same time taking
 *  into account that the token Actor might have Night Vision
 *  advantage.
 * 
 * This script assumes that it's ok to for a Night Vision 5
 *  to see in the complete darkness (-10) because we want the
 *  elf to be able to do so.
 *
 * We use DnD 5e Vision Rules on Perfect Vision module.
 *  but a custom rules will do, just set like this:
 *  - "Dim Vision in Darkness" to "Dim Light (monochrome)"
 *  - "Dim Vision in Dim Light" to "Bright Light"
 */

if (canvas.tokens.controlled.length < 1) {
  return
}

const getNightVisionValue = (list) => {
  return Object.values(list).reduce((found, el) => {
    if (found) return found

    if (el.collapsed) {
      return getNightVisionValue(el.collapsed)
    }

    const matches = el.name.match(/Night Vision (\d+)/)

    if (!matches) return

    return Number.parseFloat(matches[1])
  }, null)
}

const penaltyList = [2, 3, 5, 7, 10, 15, 20, 30, 50, 70, 100]

const getDistanceByPenalty = (penalty) => {
  if (penalty > 10) throw Error('Penalty greater then 10 not supported')
  if (penalty < 0) return 0.1
  return penaltyList[penalty]
}

const darkness = canvas.lighting.darknessLevel * 10

await canvas.tokens.controlled.map((token) => {
  const nightVision = getNightVisionValue(token.actor.data.data.ads) || 0

  const penalty = 8 - Math.max(darkness - nightVision, 0)

  const dimSight = getDistanceByPenalty(penalty)

  return token.update({ dimSight })
})
