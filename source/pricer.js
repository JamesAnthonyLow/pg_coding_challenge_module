export default class Pricer {
  static applyBaseRule(rules) {
    let adjustment = 0;
    Object.entries(rules).forEach(([name, rule]) => {
      switch (name) {
        case 'cost':
          adjustment += rule;
          break;
        default:
          break;
      }
    });
    return adjustment;
  }
  static applyIntegerRule(rules, { currentPrice, field, value }) {
    // currentPrice arg not used but it could be in the future
    let adjustment = 0;
    Object.entries(rules).forEach(([name, rule]) => {
      switch (name) {
        case 'bottom_limit':
          if (value < rule) {
            throw new Error(`${field} less than bottom limit of ${rule}`);
          }
          break;
        case 'bracket':
          if (typeof rule.start === 'undefined' || value >= rule.start) {
            let workingValue = value - rule.start;
            if (typeof rule.end !== 'undefined' && value > rule.end) {
              workingValue -= (value - rule.end);
            }
            adjustment += (Math.floor(workingValue / rule.interval) * rule.amount);
          }
          break;
        default:
          break;
      }
    });
    return adjustment;
  }
  static applyCategoryRule(rules, { currentPrice, field, value }) {
    // currentPrice arg not used but it could be in the future
    let adjustment = 0;
    Object.entries(rules).forEach(([name, rule]) => {
      switch (name) {
        case 'category_discount':
          Object.entries(rule.fields).forEach(([option, discount]) => {
            if (option === value) {
              if (rule.type === 'flat') {
                adjustment -= discount;
              } else if (rule.type === 'percent') {
                adjustment -= discount;
              }
            }
          });
          break;
        default:
          break;
      }
    });
    return adjustment;
  }
  static applyBooleanRule(rules, { currentPrice, field, value }) {
    // currentPrice arg not used but it could be in the future
    let adjustment = 0;
    const rule = value ? rules.true : rules.false;
    if (typeof rule !== 'undefined') {
      Object.entries(rule) .forEach(([option, discount]) => {
          switch (option) {
            case 'percent_increase':
              adjustment += ((currentPrice * discount) / 100.0);
              break;
            case 'percent_decrease':
              adjustment -= ((currentPrice * discount) / 100.0);
              break;
            default:
              break;
          }
        });
    }
    return adjustment;
  }
}
