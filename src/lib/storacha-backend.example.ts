/**
 * Storacha Backend Integration Example
 * 
 * This file shows how to implement backend delegation for Storacha.
 * You would implement this as an API route in your backend (e.g., Next.js API route, Express endpoint, etc.)
 * 
 * For security, the private key and delegation proof should be stored as environment variables on your server.
 */

import * as Client from '@storacha/client'
import { StoreMemory } from '@storacha/client/stores/memory'
import * as Proof from '@storacha/client/proof'
import { Signer } from '@storacha/client/principal/ed25519'
import * as DID from '@ipld/dag-ucan/did'

// These would be environment variables in your backend
const STORACHA_PRIVATE_KEY = process.env.STORACHA_PRIVATE_KEY // Generated from `storacha key create`
const STORACHA_DELEGATION_PROOF = process.env.STORACHA_DELEGATION_PROOF // Generated from `storacha delegation create`

/**
 * API endpoint: POST /api/storacha-delegation
 * 
 * This endpoint creates a delegation for a user's agent DID to upload to your Space.
 * The delegation is time-limited and scoped to only upload permissions.
 */
export async function createStorachaDelegation(userAgentDID: string): Promise<Uint8Array> {
  try {
    // Initialize backend client with stored credentials
    const principal = Signer.parse(STORACHA_PRIVATE_KEY!)
    const store = new StoreMemory()
    const client = await Client.create({ principal, store })

    // Add proof that this agent has been delegated capabilities on the space
    const proof = await Proof.parse(STORACHA_DELEGATION_PROOF!)
    const space = await client.addSpace(proof)
    await client.setCurrentSpace(space.did())

    // Create a delegation for the user's agent DID
    const audience = DID.parse(userAgentDID)
    const abilities = [
      'space/blob/add',    // Upload blob data
      'space/index/add',   // Create content indexes
      'filecoin/offer',    // Store on Filecoin
      'upload/add'         // General upload permission
    ]
    
    // Delegation expires in 24 hours
    const expiration = Math.floor(Date.now() / 1000) + (60 * 60 * 24)
    const delegation = await client.createDelegation(audience, abilities, { expiration })

    // Serialize the delegation to send to the frontend
    const archive = await delegation.archive()
    
    if (!archive.ok) {
      throw new Error('Failed to create delegation archive')
    }

    return archive.ok

  } catch (error) {
    console.error('Failed to create Storacha delegation:', error)
    throw error
  }
}

/**
 * Example Next.js API route implementation
 * File: pages/api/storacha-delegation.ts or app/api/storacha-delegation/route.ts
 */
export const nextjsAPIExample = `
// Next.js API Route Example
import { NextRequest, NextResponse } from 'next/server'
import { createStorachaDelegation } from '../../../lib/storacha-backend'

export async function POST(request: NextRequest) {
  try {
    const { did } = await request.json()
    
    if (!did) {
      return NextResponse.json({ error: 'Agent DID is required' }, { status: 400 })
    }

    const delegationBytes = await createStorachaDelegation(did)
    
    return new NextResponse(delegationBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': 'attachment; filename="delegation.car"'
      }
    })

  } catch (error) {
    console.error('Delegation error:', error)
    return NextResponse.json(
      { error: 'Failed to create delegation' },
      { status: 500 }
    )
  }
}
`

/**
 * Example Express.js endpoint implementation
 */
export const expressAPIExample = `
// Express.js API Example
import express from 'express'
import { createStorachaDelegation } from '../lib/storacha-backend'

const app = express()

app.post('/api/storacha-delegation', async (req, res) => {
  try {
    const { did } = req.body
    
    if (!did) {
      return res.status(400).json({ error: 'Agent DID is required' })
    }

    const delegationBytes = await createStorachaDelegation(did)
    
    res.set({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': 'attachment; filename="delegation.car"'
    })
    
    res.send(Buffer.from(delegationBytes))

  } catch (error) {
    console.error('Delegation error:', error)
    res.status(500).json({ error: 'Failed to create delegation' })
  }
})
`

/**
 * Setup Instructions for Backend:
 * 
 * 1. Install Storacha CLI globally:
 *    npm install -g @storacha/cli
 * 
 * 2. Login to Storacha:
 *    storacha login your-email@example.com
 *    (Click the validation link sent to your email)
 * 
 * 3. Create a Space (if not already done):
 *    storacha space create YourSpaceName
 * 
 * 4. Generate a private key for your backend:
 *    storacha key create
 *    # Store the private key (starts with "Mg...") in STORACHA_PRIVATE_KEY env var
 * 
 * 5. Create a delegation from your CLI agent to your backend agent:
 *    storacha delegation create <did_from_step_4> --base64
 *    # Store the output in STORACHA_DELEGATION_PROOF env var
 * 
 * 6. Set environment variables in your backend:
 *    STORACHA_PRIVATE_KEY=MgCY... (from step 4)
 *    STORACHA_DELEGATION_PROOF=... (from step 5)
 * 
 * 7. Deploy your backend API endpoint using the examples above
 * 
 * 8. Update your frontend to use the delegation endpoint instead of direct client creation
 */`
