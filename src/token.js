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

export default async function(ctx) {
    let body;
    try {
        body = await ctx.req.json();
    } catch (e) {
        return ctx.text("Bad Request", 400);
    }

    const { access_token } = await fetch("https://discord.com/api/oauth2/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            client_id: env.CLIENT_ID,
            client_secret: env.CLIENT_SECRET,
            grant_type: "authorization_code",
            code: body["code"],
        }),
    }).then(response => response.json());
    return ctx.json({ access_token });
};