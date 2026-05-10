import type { Node, Edge } from '@xyflow/react'

export interface TableField {
  name: string
  type: string
  isPk?: boolean
  isFk?: boolean
  isUnique?: boolean
  isNullable?: boolean
}

export interface TableData {
  label: string
  fields: TableField[]
  [key: string]: unknown
}

export type TableNode = Node<TableData, 'table'>

const users: TableNode = {
  id: 'user',
  type: 'table',
  position: { x: 80, y: 200 },
  data: {
    label: 'User',
    fields: [
      { name: 'id', type: 'String', isPk: true },
      { name: 'email', type: 'String', isUnique: true },
      { name: 'password', type: 'String' },
      { name: 'nickname', type: 'String', isUnique: true },
      { name: 'firstName', type: 'String' },
      { name: 'lastName', type: 'String' },
      { name: 'resetToken', type: 'String?', isUnique: true, isNullable: true },
      { name: 'resetTokenExpirity', type: 'DateTime?', isNullable: true },
      { name: 'avatarUrl', type: 'String?', isNullable: true },
      { name: 'coupleId', type: 'String?', isFk: true, isNullable: true },
      { name: 'createdAt', type: 'DateTime' },
      { name: 'updatedAt', type: 'DateTime' },
    ],
  },
}

const couples: TableNode = {
  id: 'couple',
  type: 'table',
  position: { x: 500, y: 30 },
  data: {
    label: 'Couple',
    fields: [
      { name: 'id', type: 'String', isPk: true },
      { name: 'createdAt', type: 'DateTime' },
    ],
  },
}

const boxes: TableNode = {
  id: 'box',
  type: 'table',
  position: { x: 900, y: 30 },
  data: {
    label: 'Box',
    fields: [
      { name: 'id', type: 'String', isPk: true },
      { name: 'name', type: 'String' },
      { name: 'description', type: 'String?', isNullable: true },
      { name: 'coupleId', type: 'String?', isFk: true, isNullable: true },
      { name: 'createdByUserId', type: 'String', isFk: true },
      { name: 'createdAt', type: 'DateTime' },
    ],
  },
}

const items: TableNode = {
  id: 'item',
  type: 'table',
  position: { x: 900, y: 340 },
  data: {
    label: 'Item',
    fields: [
      { name: 'id', type: 'String', isPk: true },
      { name: 'content', type: 'String' },
      { name: 'boxId', type: 'String', isFk: true },
      { name: 'createdByUserId', type: 'String', isFk: true },
      { name: 'createdAt', type: 'DateTime' },
    ],
  },
}

const coupleRequests: TableNode = {
  id: 'coupleRequest',
  type: 'table',
  position: { x: 80, y: 580 },
  data: {
    label: 'CoupleRequest',
    fields: [
      { name: 'id', type: 'String', isPk: true },
      { name: 'senderId', type: 'String', isFk: true },
      { name: 'receiverId', type: 'String', isFk: true },
      { name: 'status', type: 'String' },
      { name: 'createdAt', type: 'DateTime' },
    ],
  },
}

export const schemaNodes: TableNode[] = [
  users,
  couples,
  boxes,
  items,
  coupleRequests,
]

export const schemaEdges: Edge[] = [
  {
    id: 'user-couple',
    source: 'user',
    target: 'couple',
    sourceHandle: 'coupleId',
    targetHandle: 'id-src',
    label: 'N:1',
    type: 'smoothstep',
    style: { stroke: 'hsl(355 30% 58%)', strokeWidth: 2 },
    labelStyle: { fill: 'hsl(355 30% 58%)', fontWeight: 600, fontSize: 12 },
  },
  {
    id: 'couple-box',
    source: 'couple',
    target: 'box',
    sourceHandle: 'id-src',
    targetHandle: 'coupleId',
    label: '1:N',
    type: 'smoothstep',
    style: { stroke: 'hsl(356 35% 74%)', strokeWidth: 2 },
    labelStyle: { fill: 'hsl(356 35% 74%)', fontWeight: 600, fontSize: 12 },
  },
  {
    id: 'box-item',
    source: 'box',
    target: 'item',
    sourceHandle: 'id-src',
    targetHandle: 'boxId',
    label: '1:N',
    type: 'smoothstep',
    style: { stroke: 'hsl(356 35% 74%)', strokeWidth: 2 },
    labelStyle: { fill: 'hsl(356 35% 74%)', fontWeight: 600, fontSize: 12 },
  },
  {
    id: 'user-box',
    source: 'user',
    target: 'box',
    sourceHandle: 'id-src',
    targetHandle: 'createdByUserId',
    label: '1:N · createdBy',
    type: 'smoothstep',
    style: { stroke: 'hsl(17 16% 72%)', strokeWidth: 2 },
    labelStyle: { fill: 'hsl(17 16% 72%)', fontWeight: 600, fontSize: 11 },
  },
  {
    id: 'user-item',
    source: 'user',
    target: 'item',
    sourceHandle: 'id-src',
    targetHandle: 'createdByUserId',
    label: '1:N',
    type: 'smoothstep',
    style: { stroke: 'hsl(17 16% 72%)', strokeWidth: 2 },
    labelStyle: { fill: 'hsl(17 16% 72%)', fontWeight: 600, fontSize: 12 },
  },
  {
    id: 'user-sentRequests',
    source: 'user',
    target: 'coupleRequest',
    sourceHandle: 'id-src',
    targetHandle: 'senderId',
    label: '1:N · SentRequests',
    type: 'smoothstep',
    style: { stroke: 'hsl(330 7% 55%)', strokeWidth: 2, strokeDasharray: '6 3' },
    labelStyle: { fill: 'hsl(330 7% 55%)', fontWeight: 600, fontSize: 11 },
  },
  {
    id: 'user-receivedRequests',
    source: 'user',
    target: 'coupleRequest',
    sourceHandle: 'id-src',
    targetHandle: 'receiverId',
    label: '1:N · ReceivedRequests',
    type: 'smoothstep',
    style: { stroke: 'hsl(330 7% 45%)', strokeWidth: 2, strokeDasharray: '6 3' },
    labelStyle: { fill: 'hsl(330 7% 45%)', fontWeight: 600, fontSize: 11 },
  },
]