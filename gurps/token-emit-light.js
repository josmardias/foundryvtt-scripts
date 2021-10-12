/*
 * FoundryVTT
 * https://foundryvtt.com/
 * Tested with
 *
 * Perfect Vision
 * https://foundryvtt.com/packages/perfect-vision
 *
 *
 * This script adds a Dim/Bright Light to each selected token
 *
 * My playing party decided that no dim light should be cast by
 *  light sources, because our "Vision Rules" is set in a way that
 *  dim vision converts dim light into bright light inside the dim vision
 *  range.
 */

if (canvas.tokens.controlled.length < 1) {
  return
}

const lightMap = {
  none: {
    lightAngle: 360,
    dimLight: 0,
    brightLight: 0,
  },
  lightSpell: {
    lightAngle: 360,
    dimLight: 0,
    brightLight: 0.5,
    lightColor: '#ffffff',
    lightAlpha: 0.3,
    lightAnimation: {
      type: 'none',
      speed: 1,
      intensity: 10,
    },
  },
  candle: {
    lightAngle: 360,
    dimLight: 0,
    brightLight: 0.5,
    lightColor: '#a58040',
    lightAlpha: 0.1,
    lightAnimation: {
      type: 'torch',
      speed: 1,
      intensity: 10,
    },
  },
  torch: {
    lightAngle: 360,
    dimLight: 0,
    brightLight: 2,
    lightColor: '#a58040',
    lightAlpha: 0.1,
    lightAnimation: {
      type: 'torch',
      speed: 5,
      intensity: 5,
    },
  },
}

const applyChanges = async (html) => {
  const lightSource = html.find('[name="light-source"]')[0].value || 'none'

  if (lightSource === 'nochange') {
    return
  }

  const newConfig = lightMap[lightSource]

  for (const token of canvas.tokens.controlled) {
    // Update Token
    await token.update(newConfig)
  }
}

new Dialog({
  title: `Token Vision Configuration`,
  content: `
    <form>
      <div class="form-group">
        <label>Light Source</label>
        <select id="light-source" name="light-source">
          <option value="nochange">No Change</option>
          <option value="none">None</option>
          <option value="candle">Candle</option>
          <option value="lightSpell">Light (Spell)</option>
          <option value="torch">Torch</option>
        </select>
      </div>
    </form>
    `,
  buttons: {
    yes: {
      icon: "<i class='fas fa-check'></i>",
      label: `Apply`,
      callback: applyChanges,
    },
    no: {
      icon: "<i class='fas fa-times'></i>",
      label: `Cancel`,
    },
  },
}).render(true)
