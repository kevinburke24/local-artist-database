"""replace spotify_followers with album and track counts

Revision ID: c3d4e5f6a7b8
Revises: bb1ee0de32c5
Create Date: 2026-05-31 00:00:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = 'c3d4e5f6a7b8'
down_revision: Union[str, Sequence[str], None] = 'bb1ee0de32c5'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.drop_index("idx_listeners", table_name="artists")
    op.drop_column("artists", "spotify_followers")
    op.add_column("artists", sa.Column("spotify_album_count", sa.Integer(), nullable=True))
    op.add_column("artists", sa.Column("spotify_track_count", sa.Integer(), nullable=True))


def downgrade() -> None:
    op.drop_column("artists", "spotify_track_count")
    op.drop_column("artists", "spotify_album_count")
    op.add_column("artists", sa.Column("spotify_followers", sa.Integer(), nullable=True))
    op.create_index("idx_listeners", "artists", ["spotify_followers"])
