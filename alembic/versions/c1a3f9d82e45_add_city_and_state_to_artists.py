"""add city and state to artists and artist_submissions

Revision ID: c1a3f9d82e45
Revises: 549539e45a60
Create Date: 2026-05-29 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = 'c1a3f9d82e45'
down_revision: Union[str, Sequence[str], None] = '549539e45a60'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('artists', sa.Column('city', sa.String(50), nullable=True))
    op.add_column('artists', sa.Column('state', sa.String(2), nullable=True))
    op.add_column('artist_submissions', sa.Column('city', sa.String(100), nullable=True))
    op.add_column('artist_submissions', sa.Column('state', sa.String(2), nullable=True))


def downgrade() -> None:
    op.drop_column('artist_submissions', 'state')
    op.drop_column('artist_submissions', 'city')
    op.drop_column('artists', 'state')
    op.drop_column('artists', 'city')
