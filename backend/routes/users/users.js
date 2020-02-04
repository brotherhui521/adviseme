import express from 'express'
import crpyto from 'crypto'
import { createUser } from './create-user'
import { canTakeAction, permissions, permissionsList } from '../helpers/can-take-action'
import { editUser } from './edit-user'
import boom from '@hapi/boom'

const router = express.Router()

export const userRoutes = [
  {
    method: 'GET',
    path: '/users/me',
    handler: async (request, h) => {
      const user = request.auth.credentials

      return user
    },
  },
  {
    method: "GET",
    path: '/users',
    handler: async (request, h) => {
      const { user } = request
      const tenantId = user.tenantId
      canTakeAction({ user, action: permissionsList.USERS_VIEW, tenantId })
      const users = [
        {
          tenantId: 'testId',
          userId: 'userId',
          permissionLevel: 'PRIMARY_ADMIN',
        }]
      return users
    }
  },
  {
    method: "POST",
    path: '/users',
    handler: async (request, h) => {
      //Allow anonymous sign up, but mark them as unapproved.
      const { email, firstName, lastName, password, tenantId, permissionLevel = 'UNAPPROVED' } = req.body
      canTakeAction({ user, action: permissionsList.USERS_CREATE, tenantId })
      const result = await createUser({ email, firstName, lastName, password, tenantId, permissionLevel })
      return result
    }
  },
  {
    method: "PUT",
    path: '/:userId',
    handler: async (request, h) => {
      const { userId } = request.params
      const { firstName, lastName, password, tenantId, permissionLevel } = request.body
      const { user } = request.credentials
      canTakeAction({ user, action: permissionsList.USERS_EDIT, tenantId })
      if (permissionLevel) {
        canTakeAction({ user, action: permissionsList.PERMISSIONS_CHANGE, tenantId })
      }
      const result = editUser({ userId, firstName, lastName, password, tenantId, permissionLevel })
      return res.send(result)
    }
  }
]

