/**
 * activite-discord - Copyright (C) 2026 Projet ℕénuphar
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
import { env } from "cloudflare:workers";
import { InteractionType, InteractionResponseType, verifyKey } from "discord-interactions";

export default async function(ctx) {
    const rawBody = await ctx.req.text();
    if (!await verifyKey(
        rawBody,
        ctx.req.header("X-Signature-Ed25519"),
        ctx.req.header("X-Signature-Timestamp"),
        env.PUBLIC_KEY)
    ) {
        return ctx.text("Unauthorized", 401);
    }

    let body;
    try {
        body = JSON.parse(rawBody);
    } catch (e) {
        return ctx.text("Bad Request", 400);
    }

    if (body.type !== InteractionType.PING) {
        return ctx.text("Bad Request", 400);
    }

    return ctx.json({ type: InteractionResponseType.PONG });
};