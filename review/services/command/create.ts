export.module = {
    params: {
        movieId: { type: "string", required: true },
        createdById: { type: "string", required: true },
        rating: { type: "number", required: true },
        reviewText: { type: "string", optional: true },
        userRole: { type: "string", enum: ["Audience", "Critic"], required: true }
      },
      async handler(ctx: any) {
        const entity = await this.adapter.insert(ctx.params);
        // Emit event to trigger rating calculation
        this.broker.emit("review.created", { movie_id: ctx.params.movie_id });
        return entity;
      }
}