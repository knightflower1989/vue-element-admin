import Vue from 'vue'
import { newEnforcer, newModelFromString, StringAdapter } from 'casbin'

let globalEnforcer

export function getCasbinEnforce(callback) {
  if (globalEnforcer !== undefined) {
    callback(globalEnforcer)
    return
  }

  const model = Vue.$localStorage.get('model_text') || ''
  const policy = Vue.$localStorage.get('policy_text') || ''

  if (model === '' && policy === '') {
    return callback(undefined)
  }

  const casbinModel = newModelFromString(model)
  const casbinAdapter = new StringAdapter(policy)
  newEnforcer().then(enforcer => {
    enforcer.setModel(casbinModel)
    enforcer.setAdapter(casbinAdapter)
    enforcer.loadPolicy().then(() => {
      globalEnforcer = enforcer
      callback(globalEnforcer)
    })
  })
}
