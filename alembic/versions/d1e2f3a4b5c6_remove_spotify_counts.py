"""remove spotify album/track counts and updated_at timestamp

Revision ID: d1e2f3a4b5c6
Revises: c3d4e5f6a7b8
Create Date: 2026-06-01 00:00:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = 'd1e2f3a4b5c6'
down_revision: Union[str, Sequence[str], None] = 'c3d4e5f6a7b8'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.drop_column('artists', 'spotify_album_count')
    op.drop_column('artists', 'spotify_track_count')
    op.drop_column('artists', 'spotify_followers_updated_at')


def downgrade() -> None:
    op.add_column('artists', sa.Column('spotify_followers_updated_at', sa.TIMESTAMP(timezone=True), nullable=True))
    op.add_column('artists', sa.Column('spotify_track_count', sa.Integer(), nullable=True))
    op.add_column('artists', sa.Column('spotify_album_count', sa.Integer(), nullable=True))
